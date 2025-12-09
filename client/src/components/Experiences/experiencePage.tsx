import CustomCarousel from '../Shared/CustomCarousel';
import type { ExperienceObject } from '../Shared/types';
import { useLoaderData } from 'react-router-dom';
import { formatExperienceRange } from '../Shared/dateUtils';

// Component for a single experience
export default function ExperiencePage() {
    // Load experience data
    const { experience } = useLoaderData() as { experience: ExperienceObject}
    return (
        <div>
            {/* This section holds the basic information, a carousel if there are images, and a blurb about what I did there */}
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    {experience.images.length == 0 ?
                        <div className="max-w-lg md:max-w-none">
                            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                {experience.position} at {experience.company}
                            </h2>

                            <h3 className="mt-1 text-base text-gray-700 sm:text-lg">{formatExperienceRange(experience.startDate, experience.endDate)}</h3>

                            <p className="mt-4 text-sm text-gray-600 sm:text-base">
                                {experience.extra}
                            </p>
                        </div>
                        :

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                            <div className="md:col-span-1">
                                <div className="max-w-lg md:max-w-none">
                                    <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                        {experience.position} at {experience.company}
                                    </h2>

                                    <h3 className="mt-1 text-base text-gray-700 sm:text-lg">{formatExperienceRange(experience.startDate, experience.endDate, (experience.typeEx === "Personal"))}</h3>

                                    <p className="mt-4 text-sm text-gray-600 sm:text-base">
                                        {experience.extra}
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                {experience.images.length != 0 &&
                                    <CustomCarousel
                                        images={experience.images.map((image) => image.url)}
                                    />
                                }
                            </div>
                        </div>}

                </div>
            </section>
            {/* This section holds two cards that show my highlights and skills */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mx-4 my-10 sm:mx-8 lg:mx-16">
                <div>
                    <div className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                            <div className="mt-4 sm:mt-0">
                                <h3 className="text-lg font-medium text-pretty text-gray-900">
                                    Highlights of my Experience
                                </h3>
                                <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                            <div className="mt-4 sm:mt-0">
                                <h3 className="text-lg font-medium text-pretty text-gray-900">
                                    Skills Learned and Used
                                </h3>
                                <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {experience.skills.map((skill) => <li key={skill}>{skill}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}