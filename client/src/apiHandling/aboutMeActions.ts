import { redirect } from "react-router-dom";
import { makeJson, fetchJson, fetchForm } from "./http";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const data = await fetchJson(`${apiUrl}api/aboutMe`)
    if (!data) {
        throw makeJson({ message: "About Me not found" }, { status: 404, statusText: "Not found" });
    }
    return { aboutMeData: data }
}

const isNonEmptyFile = (v: FormDataEntryValue | null): v is File =>
    v instanceof File && v.size > 0;

async function update({ request }: { request: Request }) {
    const incoming = await request.formData();
    const fd = new FormData();

    // 1) Copy scalars, skipping file fields (we’ll handle those below)
    for (const [k, v] of incoming.entries()) {
        if (k === "headshotFile" || k === "resumeFile") continue; // files handled below

        // keep blanks so the server can clear fields if needed
        fd.append(k, v.toString());
    }

    // 2) Append files ONLY if non-empty (size > 0)
    const headshot = incoming.get("headshotFile");
    if (isNonEmptyFile(headshot)) {
        fd.append("headshotFile", headshot);
    }

    const resume = incoming.get("resumeFile");
    if (isNonEmptyFile(resume)) {
        // (Optional: client-side mime check; server enforces too)
        // if (resume.type !== "application/pdf") throw new Error("Resume must be a PDF");
        fd.append("resumeFile", resume);
    }

    // 3) Submit multipart (no manual Content-Type)
    await fetchForm(`${apiUrl}api/aboutMe`, fd, { method: "PUT" });

    // 4) Revalidate UI / clear inputs
    return redirect("/admin/about");
}


export { load_all, update }