import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import type { ExperienceObject } from "../components/Shared/types";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const res = await fetch(`${apiUrl}api/experiences`);
    if (!res.ok) {
        throw new Error("Failed to load experiences");
    }

    const data = await res.json();

    const formatted = data.experiences.map((exp: ExperienceObject) => ({
        ...exp,
        startDate: exp.startDate?.slice(0, 10),
        endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
    }));

    return { allExperiences: formatted };
}

async function load_one({ params }: LoaderFunctionArgs) {
    const res = await fetch(`${apiUrl}api/experiences/${params.id}`);
    if (!res) {
        throw new Error("Failed to load experience");
    }
    const data = await res.json();
    return { experience: data };
}

async function create({ request }: { request: Request }) {
    const today = new Date().toISOString().slice(0, 10);

    const res = await fetch(`${apiUrl}api/experiences`, {
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
        }),
    });

    if (!res.ok) throw new Error("Failed to create experience");

    const newExperience = await res.json();

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

        const res = await fetch(`${apiUrl}api/experiences/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to update experience");
    }

    if (method === "DELETE") {
        const res = await fetch(`${apiUrl}api/experiences/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete experience");
    }

    return redirect(`/admin/experiences`);
}

export { load_all, load_one, create, modify }