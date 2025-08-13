import { redirect } from "react-router-dom";
import { makeJson, fetchJson } from "./http";

const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const data = await fetchJson(`${apiUrl}api/aboutMe`)
    if (!data) {
        throw makeJson({message: "About Me not found"}, {status: 404, statusText: "Not found"});
    }
    return { aboutMeData: data }
}

async function update({ request }: { request: Request }) {
    const formData = await request.formData();
    // Convert formData to a plain object
    const payload = Object.fromEntries(formData);
    console.log(JSON.stringify(payload));

    await fetchJson(`${apiUrl}api/aboutMe`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })

    return redirect("/admin/about");
}


export { load_all, update }