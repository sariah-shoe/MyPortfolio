import type { LoaderFunctionArgs } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const res = await fetch(`${apiUrl}api/experiences`);
    if (!res.ok) {
        throw new Error("Failed to load experiences");
    }
    const data = await res.json();
    return { allExperiences : data.experiences};
}

async function load_one({ params }: LoaderFunctionArgs) {
    const res = await fetch(`${apiUrl}api/experiences/${params.id}`);
    if (!res) {
        throw new Error("Failed to load experience");
    }
    const data = await res.json();
    return { experience: data };
}

export { load_all, load_one }