import { redirect } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const res = await fetch(`${apiUrl}api/aboutMe`);
    if (!res.ok) {
        throw new Error("Failed to load About Me");
    }
    const data = await res.json();
    return { aboutMeData: data }
}

async function update({ request }: { request: Request }) {
    const formData = await request.formData();

    // Convert formData to a plain object
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    const response = await fetch(`${apiUrl}api/aboutMe/`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update About Me");
    }

    return redirect("/admin/about");
}


export { load_all, update }