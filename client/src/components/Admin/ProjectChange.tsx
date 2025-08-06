import List from "./List.tsx";
import type { ProjectObject } from "../Shared/types.ts";
import { Form } from "react-router-dom";

interface ProjectProps {
    project: ProjectObject;
}

export default function ProjectChange({ project }: ProjectProps) {
    return (
        <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <Form
                method="DELETE"
                action={`/admin/projects/${project._id}`}
            >
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete project
                </button>
            </Form>
            <Form
                method="PUT"
                action={`/admin/projects/${project._id}`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Name"
                        defaultValue={project.name}
                        name="name"
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Start Date"
                        defaultValue={project.startDate}
                        name="startDate"
                        type="date"
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="End Date"
                        defaultValue={project.endDate}
                        name="endDate"
                        type="date"
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="GitHub Link"
                        defaultValue={project.gitLink}
                        name="gitLink"
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Replit Link"
                        defaultValue={project.replitLink}
                        name="replitLink"
                    />
                </div>
                {/* <div>
                    <label className="font-semibold">Images:</label>
                    <List
                        name=""
                        initialItems={project.images}
                    />
                </div> */}
                <div>
                    <label className="font-semibold">Highlights:</label>
                    <List
                        name="highlights"
                        initialItems={project.highlights}
                    />
                </div>
                <div>
                    <label className="font-semibold">Skills:</label>
                    <List
                        name="skills"
                        initialItems={project.skills}
                    />
                </div>
                <div>
                    <label className="font-semibold">Extra</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        defaultValue={project.extra}
                        name="extra"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </Form>
        </div>
    )
}