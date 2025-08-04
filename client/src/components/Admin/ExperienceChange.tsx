// ExperienceChange.tsx
import { useState } from "react";
import List from "./List.tsx"

interface ExperienceObject {
    typeEx: string,
    position: string,
    company: string,
    startDate: string,
    endDate: string,
    highlights: string[],
    skills: string[],
    images: string[],
    extra: string
}

interface ExperienceProps {
    experience: ExperienceObject;
    allExperiences: ExperienceObject[];
    index: number;
    setExperiences: (newValue: ExperienceObject[]) => void;
}

export default function ExperienceChange({ experience, allExperiences, index, setExperiences }: ExperienceProps) {
    const [typeEx, setTypeEx] = useState(experience.typeEx);
    const [position, setPosition] = useState(experience.position);
    const [company, setCompany] = useState(experience.company);
    const [startDate, setStartDate] = useState(experience.startDate);
    const [endDate, setEndDate] = useState(experience.endDate);
    const [highlights, setHighlights] = useState(experience.highlights);
    const [skills, setSkills] = useState(experience.skills);
    const [images, setImages] = useState(experience.images);
    const [extra, setExtra] = useState(experience.extra);

    const deleteExperience = () => {
        setExperiences(allExperiences.filter((_, i) => i !== index));
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteExperience}
            >
                Delete experience
            </button>

            <div className="flex gap-4">
                {['Education', 'Professional', 'Personal'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name={`type-${position}`}
                            value={type}
                            checked={typeEx === type}
                            onChange={() => setTypeEx(type)}
                            className="accent-blue-600"
                        />
                        <span>{type}</span>
                    </label>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />
                <input
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
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

            <div>
                <label className="font-semibold">Images:</label>
                <List
                    itemList={images}
                    setItemList={setImages}
                />
            </div>

            <div>
                <label className="font-semibold">Extra:</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                />
            </div>

            <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Save
            </button>
        </div>
    );
}
