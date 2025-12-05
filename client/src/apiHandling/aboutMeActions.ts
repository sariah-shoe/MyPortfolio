import { redirect } from "react-router-dom";
import { makeJson, fetchJson, fetchForm } from "./http";

// Import the apiUrl from the .env
const apiUrl = import.meta.env.VITE_API_URL;

// Load all the data from about me
async function load_all() {
    // Fetch JSON
    const data = await fetchJson(`${apiUrl}api/aboutMe`)

    // AboutMe should always have data. If I get no data back, throw an error, otherwise return
    if (!data) {
        throw makeJson({ message: "About Me not found" }, { status: 404, statusText: "Not found" });
    }
    return { aboutMeData: data }
}

// Helper to check if a file is empty
const isNonEmptyFile = (v: FormDataEntryValue | null): v is File =>
    v instanceof File && v.size > 0;

// Update the about me section
async function update({ request }: { request: Request }) {
    // Take in form data and create a new form data object for us to modify
    const incoming = await request.formData();
    const fd = new FormData();

    // Copy scalars, skipping file fields
    for (const [k, v] of incoming.entries()) {
        if (k !== "headshotFile" && k !== "resumeFile"){
            fd.append(k, v.toString());
        } 
    }

    // Append headshot if it is not empty
    const headshot = incoming.get("headshotFile");
    if (isNonEmptyFile(headshot)) {
        fd.append("headshotFile", headshot);
    }

    // Append resume if it is not empty
    const resume = incoming.get("resumeFile");
    if (isNonEmptyFile(resume)) {
        fd.append("resumeFile", resume);
    }

    // Submit multipart form
    await fetchForm(`${apiUrl}api/aboutMe`, fd, { method: "PUT" });

    // Redirect back to admin/about
    return redirect("/admin/about");
}

// Export my actions
export { load_all, update }