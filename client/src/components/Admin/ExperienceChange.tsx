import { Link, Form } from "react-router-dom"
import { useState } from "react";

const experience =
{
    typeEx: "Professional",
    position: "Intern",
    company: "Denver Water",
    startDate: "06-2025",
    endDate: "",
    highlights: ["Decomissioned laptops", "Learned to assist customers"],
    skills: ["IT", "React", "Leadership"],
    images: [
        'https://www.limestone.edu/sites/default/files/styles/news_preview_image/public/2022-03/computer-programmer.jpg',
        'https://img.waterworld.com/files/base/ebm/ww/image/2024/03/65e724a21f04ab001e1d8534-dreamstime_xl_32360015.png',
        'https://dfjx2uxqg3cgi.cloudfront.net/img/photo/136096/136096_00_2x.jpg'
    ],
    extra: "Denver Water was where I built this website. My manager encouraged my professional and educational goals."
}

export default function ExperienceChange() {
    const [position, setPosition] = useState(experience.position);
    const [company, setCompany] = useState(experience.company);
    const [startDate, setStartDate] = useState(experience.startDate);
    const [endDate, setEndDate] = useState(experience.endDate);
    const [extra, setExtra] = useState(experience.extra)

    return (
        <div>
            <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Experiences</h2>
            <div className="max-h-46 overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200">
                    <thead className="sticky top-0 bg-white ltr:text-left rtl:text-right">
                        <tr className="*:font-medium *:text-gray-900">
                            <th className="px-3 py-2 whitespace-nowrap">Type</th>
                            <th className="px-3 py-2 whitespace-nowrap">Position</th>
                            <th className="px-3 py-2 whitespace-nowrap">Company</th>
                            <th className="px-3 py-2 whitespace-nowrap">Start Date</th>
                            <th className="px-3 py-2 whitespace-nowrap">End Date</th>
                            <th className="px-3 py-2 whitespace-nowrap">Highlights</th>
                            <th className="px-3 py-2 whitespace-nowrap">Skills</th>
                            <th className="px-3 py-2 whitespace-nowrap">Images</th>
                            <th className="px-3 py-2 whitespace-nowrap">Extra</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        <tr className="*:text-gray-900 *:first:font-medium">
                            <td className="px-3 py-2 whitespace-nowrap">
                                <fieldset className="space-y-3">
                                    <legend className="sr-only">Type of Experience</legend>

                                    <div>
                                        <label
                                            htmlFor="Education"
                                            className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600"
                                        >
                                            <div>
                                                <p className="text-gray-700">Education</p>
                                            </div>

                                            <input
                                                type="radio"
                                                name="Education"
                                                value="Education"
                                                id="Education"
                                                className="size-5 border-gray-300"
                                                checked
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="Professional"
                                            className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600"
                                        >
                                            <div>
                                                <p className="text-gray-700">Professional</p>
                                            </div>

                                            <input
                                                type="radio"
                                                name="Professional"
                                                value="Professional"
                                                id="Professional"
                                                className="size-5 border-gray-300"
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="Personal"
                                            className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600"
                                        >
                                            <div>
                                                <p className="text-gray-700">Personal</p>
                                            </div>

                                            <input
                                                type="radio"
                                                name="Personal"
                                                value="Personal"
                                                id="Personal"
                                                className="size-5 border-gray-300"
                                            />
                                        </label>
                                    </div>
                                </fieldset>
                            </td>

                            <td className="px-3 py-2 whitespace-nowrap">
                                <input value={position} onChange={(e) => setPosition(e.target.value)} />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                                <input value={company} onChange={(e) => setCompany(e.target.value)} />
                            </td>

                            <td className="px-3 py-2 whitespace-nowrap">
                                <input value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </td>

                            <td className="px-3 py-2 whitespace-nowrap">
                                <input value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </td>

                            <td className="px-3 py-2 whitespace-nowrap">$0</td>

                            <td className="px-3 py-2 whitespace-nowrap">$0</td>

                            <td className="px-3 py-2 whitespace-nowrap">$0</td>

                            <td className="px-3 py-2 whitespace-nowrap">
                                <textarea value={extra} onChange={(e) => setExtra(e.target.value)} />
                            </td>

                            <td className="px-3 py-2 whitespace-nowrap">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Link to={"/admin"} className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">Back to Admin</Link>
        </div>
    )
}