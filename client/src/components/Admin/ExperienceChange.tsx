// ExperienceChange.tsx
import List from "./List.tsx"
import type { ExperienceObject } from "../Shared/types.ts";
import { useFormDirtyState } from "../../hooks/useFormDirtyState.ts";
import { Form } from "react-router-dom";
import FileListEditor from "./FileListEditor.tsx";
import { useMemo } from "react";

interface ExperienceProps {
    experience: ExperienceObject;
    resetKey?: number;
    onSubmitStart?: (position: string) => void;
    onDangerousSubmit?: () => void;
    onDirtyChange?: (id: string, isDirty: boolean) => void;
}

export default function ExperienceChange({ experience, onSubmitStart, onDirtyChange, onDangerousSubmit, resetKey }: ExperienceProps) {
    const baseline = useMemo(() => ({
        position: experience.position ?? "",
        company: experience.company ?? "",
        startDate: experience.startDate?.slice(0, 10) ?? "",
        endDate: experience.endDate?.slice(0, 10) ?? "",
        extra: experience.extra ?? "",
    }), [
        experience.position,
        experience.company,
        experience.startDate,
        experience.endDate,
        experience.extra,
    ]);

    const { formRef, isDirty, childDirty } = useFormDirtyState({
        baseline,
        resetKey,
        onDirtyChange: (dirty) => onDirtyChange?.(experience._id, dirty),
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <Form
                method="delete"
                action={`/admin/experiences/${experience._id}`}
                onSubmit={() => onDangerousSubmit?.()}
            >
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete experience
                </button>
            </Form>

            <Form
                method="put"
                action={`/admin/experiences/${experience._id}`}
                onSubmit={() => onSubmitStart?.(experience.position)}
                ref={formRef}
            >

                {isDirty && <div role="status" className="border-s-4 border-yellow-700 bg-yellow-50 p-4">
                    <div className="flex items-center gap-2 text-yellow-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path
                                fillRule="evenodd"
                                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>

                        <strong className="font-medium"> Unsaved Changes </strong>
                    </div>

                    <p className="mt-2 text-sm text-yellow-700">
                        You have made changes to this experience. If you do not save the experience, you will lose your changes when you navigate away.
                    </p>
                </div>}

                <div className="flex gap-4">
                    <fieldset className="mb-4">
                        <legend className="text-sm font-medium text-gray-700">Experience Type</legend>

                        <div className="mt-2 space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="typeEx"
                                    value="Professional"
                                    defaultChecked={experience.typeEx === "Professional"}
                                />
                                <span>Professional</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="typeEx"
                                    value="Education"
                                    defaultChecked={experience.typeEx === "Education"}
                                />
                                <span>Education</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="typeEx"
                                    value="Personal"
                                    defaultChecked={experience.typeEx === "Personal"}
                                />
                                <span>Personal</span>
                            </label>
                        </div>
                    </fieldset>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Position"
                        defaultValue={experience.position}
                        name="position"
                        required
                        maxLength={100}
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Company"
                        defaultValue={experience.company}
                        name="company"
                        maxLength={100}
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Start Date"
                        type="date"
                        defaultValue={experience.startDate?.slice(0, 10) ?? ""}
                        name="startDate"
                        required
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="End Date"
                        type="date"
                        defaultValue={experience.endDate?.slice(0, 10) ?? ""}
                        name="endDate"
                    />
                </div>

                <div className="mt-2">
                    <label className="font-semibold">Highlights:</label>
                    <List
                        name="highlights"
                        initialItems={experience.highlights}
                        onDirty={(dirty) => childDirty(dirty)}
                    />
                </div>

                <div className="mt-2">
                    <label className="font-semibold">Skills:</label>
                    <List
                        name="skills"
                        initialItems={experience.skills}
                        onDirty={(dirty) => childDirty(dirty)}
                    />
                </div>

                <div className="mt-2">
                    <label className="font-semibold">Images:</label>
                    <FileListEditor
                        initialFiles={experience.images}
                    />
                </div>

                <div className="mt-2">
                    <label className="font-semibold">Extra:</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        defaultValue={experience.extra}
                        name="extra"
                        maxLength={2000}
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Save
                </button>
            </Form>
        </div>
    );
}
