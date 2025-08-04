const apiUrl = import.meta.env.VITE_API_URL;

async function load_all() {
    const res = await fetch(`${apiUrl}api/aboutMe`);
    if (!res.ok) {
        throw new Error("Failed to load About Me");
    }
    const data = await res.json();
    return { aboutMeData: data }
}

export { load_all }