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

// Function to fetch using json
export async function fetchJson(input: RequestInfo, init?: RequestInit) {
  // Response variable
  let res: Response;

  // Try to fetch using the information passed
  try {
    res = await fetch(input, init);
  } catch { // Throw an error if it occurs
    throw new Response(JSON.stringify({ message: "Network error. Please try again later." }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    });
  }

  // If response isn't okay, get the error and throw it
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

  // Parse and return the text
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Submit multipart/form-data
export async function fetchForm(input: RequestInfo, formData: FormData, init?: RequestInit) {
  // Response variable
  let res: Response;

  // Try to fetch using the information passed
  try {
    res = await fetch(input, {
      ...init,
      method: init?.method ?? "POST", // Default is post but can be overridden
      body: formData,
      credentials: "include", // All forms will need credentials
    });
  } catch { // Catch network errors
    throw new Response(JSON.stringify({ message: "Network error. Please try again later." }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    });
  }

  // If response isn't okay, get error and throw it
  if (!res.ok) {
    let data: any = null;
    try { data = await res.json(); } catch { }
    throw new Response(JSON.stringify({
      message: data?.message ?? data?.error ?? res.statusText ?? "Request failed",
      errors: data?.errors,
    }), {
      status: res.status,
      statusText: res.statusText,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Success paths with no body
  if (res.status === 204 || res.status === 205 || init?.method === "HEAD") return null;

  // Safely read body and parse only if present
  const text = await res.text();
  if (!text) return null;

  // Parse and return the text
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Submit a login request (NOTE: May deprecate later and just use fetch instead)
export async function loginRequest(input: RequestInfo, email: string, password: string) {
  //
  let res: Response;
  let body = JSON.stringify({ email, password })

  // Try to fetch using information passed
  try {
    res = await fetch(input, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      credentials: "include"
    });
  } catch {
    throw new Response(JSON.stringify({ message: "Network error. Please try again later." }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    });
  }

  // If response isn't ok, get an error and throw it
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
  if (res.status === 204 || res.status === 205) return null;

  // Safely read body and parse only if present
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}