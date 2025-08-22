import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import type { ExperienceObject } from "../components/Shared/types";
import { makeJson, fetchJson, fetchForm } from "./http";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const data = await fetchJson(`${apiUrl}api/experiences`);
    if (!data) {
        throw makeJson({ message: "Experiences not found" }, { status: 404, statusText: "Not found" });
    }
    const formatted = data.experiences.map((exp: ExperienceObject) => ({
        ...exp,
        startDate: exp.startDate?.slice(0, 10),
        endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
    }));

    return { allExperiences: formatted };
}

async function load_one({ params }: LoaderFunctionArgs) {
    const data = await fetchJson(`${apiUrl}api/experiences/${params.id}`)
    if (!data) {
        throw makeJson({ message: `Experience ${params.id} not found` }, { status: 404, statusText: "Not found" });
    }
    return { experience: data };
}

// Create a new empty experience
async function create() {
    const today = new Date().toISOString().slice(0, 10);

    await fetchJson(`${apiUrl}api/experiences`, {
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
        })
    })

    return redirect("/admin/experiences");
}

// PUT and DELETE are combined so that there is one action for my /admin/experiences/:id
async function modify({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();
    const id = params.id;

    if (method === "PUT") {
        // --- 1) Build your scalars exactly like you already do ---
        const body: Record<string, string> = Object.fromEntries(
            Array.from(formData.entries())
                .filter(([k]) =>
                    // exclude array-style fields + our file/delete fields
                    !k.startsWith("highlights[") &&
                    !k.startsWith("skills[") &&
                    k !== "newImages" &&
                    k !== "deleteFileIds"
                )
                // keep empty strings so fields can be cleared
                .map(([k, v]) => [k, v.toString()])
        );

        // --- 2) Build arrays the way you already do ---
        const getArray = (prefix: string) =>
            Array.from(formData.entries())
                .filter(([k]) => k.startsWith(prefix))
                .map(([, v]) => v.toString().trim())
                .filter((v) => v !== "");

        const highlights = getArray("highlights[");
        const skills = getArray("skills[");

        // --- 3) Create a fresh FormData and append everything ---
        const fd = new FormData();

        // scalars (include empty strings so backend clears fields)
        for (const [k, v] of Object.entries(body)) fd.append(k, v);

        // arrays: send JSON strings (simple + unambiguous for the server)
        // IMPORTANT: still append when [], so backend can clear
        fd.append("highlights", JSON.stringify(highlights));
        fd.append("skills", JSON.stringify(skills));

        // deletions: pass through from hidden input; default to "[]"
        const deleteFileIds = formData.get("deleteFileIds")?.toString() ?? "[]";
        fd.append("deleteFileIds", deleteFileIds);

        // files: forward everything picked in <input name="newImages" multiple>
        for (const file of formData.getAll("newImages")) {
            fd.append("newImages", file as File);
        }

        // --- 4) Submit as multipart (do NOT set Content-Type) ---
        return fetchForm(
            `${apiUrl}api/experiences/${params.id}`,
            fd,
            { method: "PUT" }
        );
    }

    if (method === "DELETE") {
        await fetchJson(`${apiUrl}api/experiences/${id}`, { method: "DELETE" });
    }

    return redirect(`/admin/experiences`);
}

export { load_all, load_one, create, modify }