import { Link, useLoaderData, Form } from "react-router-dom";
import ProjectChange from "./ProjectChange";
import type { ProjectObject } from "../Shared/types";

export default function ProjectCards() {
    const { allProjects } = useLoaderData() as { allProjects: ProjectObject[] }

    return (
        <div className="px-6 py-4">
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">Projects</h2>
            <Link
                to={"/admin"}
                className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
            <div className="space-y-6">
                {allProjects.map((project, idx) =>
                    <ProjectChange
                        key={idx}
                        project={project}
                    />
                )}

                <Form
                    method="POST"
                    action={`/admin/projects`}
                >
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add Project
                    </button>
                </Form>
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