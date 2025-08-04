import type { LoaderFunctionArgs } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const res = await fetch(`${apiUrl}api/projects`);
    if (!res.ok) {
        throw new Error("Failed to load projects]");
    }
    const data = await res.json();
    return { allProjects : data.projects};
}

async function load_one({ params }: LoaderFunctionArgs) {
    const res = await fetch(`${apiUrl}api/projects/${params.id}`);
    if (!res) {
        throw new Error("Failed to load project");
    }
    const data = await res.json();
    return { project: data };
}

export { load_all, load_one }