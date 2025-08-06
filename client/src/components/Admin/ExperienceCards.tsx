// ExperienceCards.tsx
import { Link, useLoaderData, Form } from "react-router-dom";
import ExperienceChange from "./ExperienceChange";
import type { ExperienceObject } from "../Shared/types";

export default function ExperienceCards() {
    const { allExperiences } = useLoaderData() as { allExperiences: ExperienceObject[] }

    return (
        <div className="px-6 py-4">
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">Experiences</h2>
            <Link
                to="/admin"
                className="inline-block text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
            <div className="space-y-6 mt-4">
                {allExperiences.map((experience, idx) => (
                    <ExperienceChange
                        key={idx}
                        experience={experience}
                    />
                ))}

                <Form
                    method="POST"
                    action={`/admin/experiences`}
                >
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add Experience
                    </button>
                </Form>
            </div>
            <Link
                to="/admin"
                className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
        </div>
    );
}
