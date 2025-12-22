import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import type { ExperienceObject } from "../components/Shared/types";
import { makeJson, fetchJson, fetchForm } from "./http";

// Load all experiences
async function load_all() {
    // Fetch data
    const data = await fetchJson(`/api/experiences`);

    // Throw an error if nothing is returned
    if (!data) {
        throw makeJson({ message: "Experiences not found" }, { status: 404, statusText: "Not found" });
    }

    // Map the data to the format I want, including making the dates more friendly
    const formatted = data.experiences.map((exp: ExperienceObject) => ({
        ...exp,
        startDate: exp.startDate?.slice(0, 10),
        endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
    }));

    // Return formatted experiences
    return { allExperiences: formatted };
}

// Load one experience
async function load_one({ params }: LoaderFunctionArgs) {
    // Fetch data
    const data = await fetchJson(`/api/experiences/${params.id}`)

    // Throw error if nothing is returned
    if (!data) {
        throw makeJson({ message: `Experience ${params.id} not found` }, { status: 404, statusText: "Not found" });
    }

    // Return experience
    return { experience: data };
}

// Create a new empty experience
async function create() {
    // Set date to today
    const today = new Date().toISOString().slice(0, 10);

    // Create an empty experience with the defaults in body
    await fetchJson(`/api/experiences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            position: "New Position",
            company: "",
            typeEx: "Professional",
            startDate: today,
            endDate: "",
            highlights: [],
            skills: [],
            images: [],
            extra: ""
        },),
        credentials: "include",
    })

    // Redirect to experiences when done
    return redirect("/admin/experiences");
}

// PUT and DELETE are combined so that there is one action for my /admin/experiences/:id
async function modify({ request, params }: ActionFunctionArgs) {
    // Get the form data, method, and id
    const formData = await request.formData();
    const method = request.method.toUpperCase();
    const id = params.id;

    if (method === "PUT") {
        // Build scalars
        const body: Record<string, string> = Object.fromEntries(
            Array.from(formData.entries())
                .filter(([k]) =>
                    // exclude array-style fields + file/delete fields
                    !k.startsWith("highlights[") &&
                    !k.startsWith("skills[") &&
                    k !== "newImages" &&
                    k !== "deleteFileIds"
                )
                .map(([k, v]) => [k, v.toString()])
        );

        // Build cleaned arrays
        const getArray = (prefix: string) =>
            Array.from(formData.entries())
                .filter(([k]) => k.startsWith(prefix))
                .map(([, v]) => v.toString().trim())
                .filter((v) => v !== "");

        const highlights = getArray("highlights[");
        const skills = getArray("skills[");

        // Create a fresh FormData and append everything
        const fd = new FormData();

        // scalars
        for (const [k, v] of Object.entries(body)) fd.append(k, v);

        // arrays
        fd.append("highlights", JSON.stringify(highlights));
        fd.append("skills", JSON.stringify(skills));

        // deletions: pass through from hidden input; default to "[]"
        const deleteFileIds = formData.get("deleteFileIds")?.toString() ?? "[]";
        fd.append("deleteFileIds", deleteFileIds);

        // files: forward everything picked in <input name="newImages" multiple>
        for (const file of formData.getAll("newImages")) {
            fd.append("newImages", file as File);
        }

        // Submit as multipart
        return fetchForm(
            `$/api/experiences/${params.id}`,
            fd,
            { method: "PUT" }
        );
    }

    // Delete an experience
    if (method === "DELETE") {
        // Use fetch to try and delete
        await fetchJson(`/api/experiences/${id}`, { method: "DELETE", credentials: "include" });
    }

    // Redirect back to experiences
    return redirect(`/admin/experiences`);
}

export { load_all, load_one, create, modify }