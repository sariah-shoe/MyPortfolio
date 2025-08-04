import { useState } from "react";
import { Link } from "react-router-dom";
import ProjectChange from "./ProjectChange";

interface ProjectObject {
    name: string,
    startDate: string,
    endDate: string,
    images: string[],
    link: string,
    highlights: string[],
    skills: string[],
    extra: string
}

const exampleProjects: ProjectObject[] = [
    {
        name: "Portfolio",
        startDate: "07-2025",
        endDate: "",
        images: [],
        link: "",
        highlights: ["Made portfolio using MERN stack", "Learned about Tailwind CSS"],
        skills: ["Node.js", "React", "Express.js", "MongoDB", "Tailwind", "Generative AI"],
        extra: "This was fun"
    },
    {
        name: "Hackathon 2025",
        startDate: "2025-04-25",
        endDate: "2025-04-26",
        images: [],
        link: "",
        highlights: ["Coded a project in 24 hours", "Collaborated with strangers"],
        skills: ["Flutter", "Django", "Teamwork"],
        extra: "Woo!"
    }
]

export default function ProjectCards() {
    const [projects, setProjects] = useState(exampleProjects);

    return(
        <div className="px-6 py-4">
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">Projects</h2>
            <div className="space-y-6">
            {projects.map((project, idx) => 
            <ProjectChange 
                key={idx}
                project={project}
                allProjects={projects}
                index={idx}
                setProjects={setProjects}
            />
            )}
            </div>
            <Link 
            to={"/admin"}
            className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
        </div>
    )
}