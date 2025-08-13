import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import type { ExperienceObject } from "../components/Shared/types";
import { makeJson, fetchJson } from "./http";

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
        // 1) Scalars: keep empty strings so fields can be cleared
        const body: Record<string, any> = Object.fromEntries(
            Array.from(formData.entries())
                .filter(([k]) =>
                    !k.startsWith("highlights[") &&
                    !k.startsWith("skills[") &&
                    !k.startsWith("images[") // if you later use images[] in the form
                )
                .map(([k, v]) => [k, v.toString()])
        );

        // 2) Arrays: trim; drop empty; and IMPORTANT: send [] if user cleared all
        const getArray = (prefix: string) =>
            Array.from(formData.entries())
                .filter(([k]) => k.startsWith(prefix))
                .map(([, v]) => v.toString().trim())
                .filter((v) => v !== "");

        const highlights = getArray("highlights[");
        const skills = getArray("skills[");

        body.highlights = highlights; // [] will clear on backend
        body.skills = skills;         // [] will clear on backend

        // If you’re not handling images yet, either omit images entirely
        // or send [] to clear them explicitly:
        // body.images = [];

        const data = await fetchJson(`${apiUrl}api/experiences/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!data) {
            throw makeJson({ message: `Experience ${id} not found` }, { status: 404, statusText: "Not found" });
        }
    }

    if (method === "DELETE") {
        await fetchJson(`${apiUrl}api/experiences/${id}`, { method: "DELETE" });
    }

    return redirect(`/admin/experiences`);
}

export { load_all, load_one, create, modify }