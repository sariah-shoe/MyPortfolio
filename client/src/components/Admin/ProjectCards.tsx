import { Link, useLoaderData, Form, useNavigation } from "react-router-dom";
import ProjectChange from "./ProjectChange";
import type { ProjectObject } from "../Shared/types";
import { useState, useEffect, useRef } from "react";

export default function ProjectCards() {
    const { allProjects } = useLoaderData() as { allProjects: ProjectObject[] }
    const navigation = useNavigation();
    const [showToast, setShowToast] = useState(false);
    const [wasSubmitting, setWasSubmitting] = useState(false);
    const [lastEdited, setLastEdited] = useState<string | null>(null);
    const lastEditedRef = useRef<string | null>(null);

    useEffect(() => {
        if (navigation.state === "submitting" && navigation.formMethod?.toLowerCase() === "put") {
            setWasSubmitting(true);
        }
    }, [navigation.state, navigation.formMethod]);

    useEffect(() => {
        if (wasSubmitting && navigation.state === "idle") {
            setLastEdited(lastEditedRef.current); // manually set lastEdited state
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setWasSubmitting(false);
        }
    }, [navigation.state, wasSubmitting]);

    return (
        <div className="px-6 py-4">
            {showToast && (
                <div role="alert" className="fixed top-4 right-4 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 text-green-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        <div className="flex-1">
                            <strong className="font-medium text-gray-900"> Changes saved </strong>

                            <p className="mt-0.5 text-sm text-gray-700">{lastEdited
                                ? `Your changes to "${lastEdited}" have been saved.`
                                : "Your project changes have been saved."}
                            </p>
                        </div>

                        <button
                            className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            type="button"
                            aria-label="Dismiss alert"
                            onClick={() => setShowToast(false)}
                        >
                            <span className="sr-only">Dismiss popup</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
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
                        onSubmitStart={(position) => {
                            lastEditedRef.current = position;
                        }}

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