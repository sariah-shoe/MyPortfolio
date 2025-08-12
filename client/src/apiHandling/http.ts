// src/apiHandling/http.ts

// Helper function to parse and return the response
export function makeJson(
  data: unknown,
  init: ResponseInit = {}
): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export async function fetchJson(input: RequestInfo, init?: RequestInit) {
  let res: Response;

  // Network errors -> throw a Response so errorElement can render nicely
  try {
    res = await fetch(input, init);
  } catch {
    throw new Response(JSON.stringify({ message: "Network error. Please try again later." }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    });
  }

  // Non-2xx -> try to surface server JSON; otherwise use status text
  if (!res.ok) {
    let data: any = null;
    try { data = await res.json(); } catch { }
    throw new Response(JSON.stringify({
      message: data?.message ?? data?.error ?? res.statusText ?? "Request failed",
      errors: data?.errors,
    }), {
      status: res.status,
      statusText: res.statusText,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Success paths with no body
  if (res.status === 204 || res.status === 205 || init?.method === "HEAD") return null;

  // Safely read body and parse only if present
  const text = await res.text();
  if (!text) return null;

  // If it's JSON, parse; otherwise return text
  // (optional: you can require JSON by checking content-type)
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}