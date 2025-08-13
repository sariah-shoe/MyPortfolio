import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import type { ProjectObject } from "../components/Shared/types";
import { makeJson, fetchJson } from "./http";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const data = await fetchJson(`${apiUrl}api/projects`);
    if (!data) {
        throw makeJson({ message: "Experiences not found" }, { status: 404, statusText: "Not found" });
    }

    const formatted = data.projects.map((exp: ProjectObject) => ({
        ...exp,
        startDate: exp.startDate?.slice(0, 10),
        endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
    }));
    return { allProjects: formatted };
}

async function load_one({ params }: LoaderFunctionArgs) {
    const data = await fetchJson(`${apiUrl}api/projects/${params.id}`);
    if (!data) {
        throw makeJson({ message: `Experience ${params.id} not found` }, { status: 404, statusText: "Not found" });
    }
    return { project: data };
}

async function create() {
    const today = new Date().toISOString().slice(0, 10);

    await fetchJson(`${apiUrl}api/projects`, {
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

    return redirect("/admin/projects");
}

// PUT and DELETE are combined so that there is one action for my /admin/projects/:id
async function modify({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();
    const id = params.id;

    if (method === "PUT") {
        const entries = Array.from(formData.entries());

        // 1) Scalars: use Object.fromEntries but exclude array-style keys
        const body: Record<string, any> = Object.fromEntries(
            entries
                .filter(
                    ([k]) =>
                        !k.startsWith("highlights[") &&
                        !k.startsWith("skills[") &&
                        !k.startsWith("images[") // if you later add images[] inputs
                )
                .map(([k, v]) => [k, v.toString()]) // preserve "" for clears
        );

        // 2) Arrays: trim, drop empties; still send [] to clear when user removed all
        const toArray = (prefix: string) =>
            entries
                .filter(([k]) => k.startsWith(prefix))
                .map(([, v]) => v.toString().trim())
                .filter((v) => v !== "");

        body.highlights = toArray("highlights[");
        body.skills = toArray("skills[");

        // If you want “clear images” behavior for now, explicitly send []:
        body.images = [];

        const data = await fetchJson(`${apiUrl}api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!data) {
            throw makeJson({ message: `Project ${id} not found` }, { status: 404, statusText: "Not found" });
        }

    }

    if (method === "DELETE") {
        await fetchJson(`${apiUrl}api/projects/${id}`, {method: "DELETE",});
    }

    return redirect(`/admin/projects`);
}

export { load_all, load_one, create, modify }