import { fetchJson } from "./http";

type ContactActionResult = {
  success: boolean;
};

const apiUrl = import.meta.env.VITE_API_URL;

export async function sendEmail({ request }: { request: Request }): Promise<ContactActionResult> {
  try {
    // Read form data from the router
    const formData = await request.formData();

    // Convert to plain object
    const payload = Object.fromEntries(formData);
    console.log(payload);

    // Send to backend
    await fetchJson(`${apiUrl}api/contact`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    // Signal success to the UI
    return { success: true };
  } catch (err) {
    console.error("Contact action error:", err);

    // Signal failure (do NOT throw — let UI handle it)
    return { success: false };
  }
}