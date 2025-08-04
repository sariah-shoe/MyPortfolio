// ExperienceTable.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import ExperienceChange from "./ExperienceChange";

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

const exampleExperiences: ExperienceObject[] = [
    {
        typeEx: "Professional",
        position: "Intern",
        company: "Denver Water",
        startDate: "06-2025",
        endDate: "",
        highlights: ["Decomissioned laptops", "Learned to assist customers"],
        skills: ["IT", "React", "Leadership"],
        images: [],
        extra: "This was a great experience!"
    },
    {
        typeEx: "Education",
        position: "Major in Computer Science and German",
        company: "University of Denver",
        startDate: "09-2022",
        endDate: "11-2025",
        highlights: ["Honor roll"],
        skills: ["C", "Python", "React"],
        images: [],
        extra: "Learned so much!"
    },
    {
        typeEx: "Personal",
        position: "Married my husband",
        company: "",
        startDate: "09-2023",
        endDate: "",
        highlights: [""],
        skills: ["Love", "Teamwork"],
        images: [],
        extra: "Love of my life!"
    },
    {
        typeEx: "Personal",
        position: "Got my kitties",
        company: "",
        startDate: "09-2023",
        endDate: "",
        highlights: ["The orange one is Chise", "The grey and white one is Lou"],
        skills: ["Cat care", "Patience"],
        images: [],
        extra: "Love them so much!"
    }
];

export default function ExperienceTable() {
    const [experiences, setExperiences] = useState(exampleExperiences);

    const handleAddExperience = () => {
        const emptyExperience: ExperienceObject = {
            typeEx: "Professional",  // or default to "Personal" / "Education"
            position: "",
            company: "",
            startDate: "",
            endDate: "",
            highlights: [],
            skills: [],
            images: [],
            extra: ""
        };

        setExperiences([...experiences, emptyExperience]);
    }

    return (
        <div className="px-6 py-4">
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">Experiences</h2>
            <div className="space-y-6">
                {experiences.map((experience, idx) => (
                    <ExperienceChange 
                    key={idx} 
                    experience={experience} 
                    allExperiences={experiences}
                    index={idx}
                    setExperiences={setExperiences}
                    />
                ))}

                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAddExperience}
                >
                    Add Experience
                </button>
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
