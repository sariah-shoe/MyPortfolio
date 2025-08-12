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
        const rawFields = {
            position: formData.get("position")?.toString(),
            company: formData.get("company")?.toString(),
            typeEx: formData.get("typeEx")?.toString(),
            startDate: formData.get("startDate")?.toString(),
            endDate: formData.get("endDate")?.toString(),
            extra: formData.get("extra")?.toString(),
        };

        // Remove blank string fields
        const body: Record<string, any> = {};
        for (const [key, value] of Object.entries(rawFields)) {
            if (value && value.trim() !== "") {
                body[key] = value;
            }
        }

        // Extract highlights[] and skills[] from form entries
        const highlights = Array.from(formData.entries())
            .filter(([key]) => key.startsWith("highlights["))
            .map(([, value]) => value.toString())
            .filter(v => v.trim() !== "");

        if (highlights.length > 0) {
            body.highlights = highlights;
        }

        const skills = Array.from(formData.entries())
            .filter(([key]) => key.startsWith("skills["))
            .map(([, value]) => value.toString())
            .filter(v => v.trim() !== "");

        if (skills.length > 0) {
            body.skills = skills;
        }

        // Leave images empty for now or process if needed
        body.images = [];

        const data = await fetchJson(`${apiUrl}api/experiences/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!data) {
            throw makeJson({ message: `Experience ${id} not found` }, { status: 404, statusText: "Not found" });
        }
    }

    if (method === "DELETE") {
        await fetchJson(`${apiUrl}api/experiences/${id}`, {method: "DELETE"});
    }

    return redirect(`/admin/experiences`);
}

export { load_all, load_one, create, modify }