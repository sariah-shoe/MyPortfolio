import { useState } from "react";
import List from "./List.tsx";

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

interface ProjectProps {
    project: ProjectObject;
    allProjects: ProjectObject[];
    index: number;
    setProjects: (newValue: ProjectObject[]) => void;
}

export default function ProjectChange({ project, allProjects, index, setProjects }: ProjectProps) {
    const [name, setName] = useState(project.name);
    const [startDate, setStartDate] = useState(project.startDate);
    const [endDate, setEndDate] = useState(project.endDate);
    const [images, setImages] = useState(project.images);
    const [link, setLink] = useState(project.link);
    const [highlights, setHighlights] = useState(project.highlights);
    const [skills, setSkills] = useState(project.skills);
    const [extra, setExtra] = useState(project.extra);

    const deleteProject = () => {
        setProjects(allProjects.filter((_, i) => i !== index));
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteProject}
            >
                Delete project
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Extra"
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                />
            </div>
            <div>
                <label className="font-semibold">Images:</label>
                <List
                    itemList={images}
                    setItemList={setImages}
                />
            </div>
            <div>
                <label className="font-semibold">Highlights:</label>
                <List
                    itemList={highlights}
                    setItemList={setHighlights}
                />
            </div>
            <div>
                <label className="font-semibold">Skills:</label>
                <List
                    itemList={skills}
                    setItemList={setSkills}
                />
            </div>
        </div>
    )
}