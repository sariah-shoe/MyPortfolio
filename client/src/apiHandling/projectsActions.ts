import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import type { ProjectObject } from "../components/Shared/types";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const res = await fetch(`${apiUrl}api/projects`);
    if (!res.ok) {
        throw new Error("Failed to load projects]");
    }
    const data = await res.json();

    const formatted = data.projects.map((exp: ProjectObject) => ({
        ...exp,
        startDate: exp.startDate?.slice(0, 10),
        endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
    }));
    return { allProjects: formatted };
}

async function load_one({ params }: LoaderFunctionArgs) {
    const res = await fetch(`${apiUrl}api/projects/${params.id}`);
    if (!res) {
        throw new Error("Failed to load project");
    }
    const data = await res.json();
    return { project: data };
}

async function create({ request }: { request: Request }) {
    const today = new Date().toISOString().slice(0, 10);

    const res = await fetch(`${apiUrl}api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "New Project",
            startDate: today,
            endDate: "",
            gitLink: "",
            replitLink: "",
            highlights: [],
            skills: [],
            images: [],
            extra: ""
        }),
    });

    if (!res.ok) throw new Error("Failed to create project");

    const newProject = await res.json();

    return redirect("/admin/projects");
}

// PUT and DELETE are combined so that there is one action for my /admin/projects/:id
async function modify({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();
    const id = params.id;

    if (method === "PUT") {
        const rawFields = {
            name: formData.get("name")?.toString(),
            startDate: formData.get("startDate")?.toString(),
            endDate: formData.get("endDate")?.toString(),
            gitLink: formData.get("gitLink")?.toString(),
            replitLink: formData.get("replitLink")?.toString(),
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

        const res = await fetch(`${apiUrl}api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to update project");
    }

    if (method === "DELETE") {
        const res = await fetch(`${apiUrl}api/projects/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete project");
    }

    return redirect(`/admin/projects`);
}

export { load_all, load_one, create, modify }