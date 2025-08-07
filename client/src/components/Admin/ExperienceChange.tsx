// ExperienceChange.tsx
import List from "./List.tsx"
import type { ExperienceObject } from "../Shared/types.ts";
import { Form } from "react-router-dom";
import FileListEditor from "./FileListEditor.tsx";

interface ExperienceProps {
    experience: ExperienceObject;
    onSubmitStart?: (position: string) => void;
}

export default function ExperienceChange({ experience, onSubmitStart }: ExperienceProps) {
    return (
        <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <Form 
                method="delete" 
                action={`/admin/experiences/${experience._id}`}
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
            >
                {/* Hidden input so that I can have my toast show the experience saved */}
                <input type="hidden" name="position" value={experience.position}/>

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
                        defaultValue={experience.startDate}
                        name="startDate"
                        required
                    />
                    <input
                        className="p-2 border border-gray-300 rounded"
                        placeholder="End Date"
                        type="date"
                        defaultValue={experience.endDate}
                        name="endDate"
                    />
                </div>

                <div className="mt-2">
                    <label className="font-semibold">Highlights:</label>
                    <List
                        name="highlights"
                        initialItems={experience.highlights}
                    />
                </div>

                <div className="mt-2">
                    <label className="font-semibold">Skills:</label>
                    <List
                        name="skills"
                        initialItems={experience.skills}
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
