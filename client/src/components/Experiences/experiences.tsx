import ProffToggle from '../Shared/ProffToggle';
import SearchBar from '../Shared/SearchBar';
import Filter from '../Shared/Filter';
import type { ExperienceObject } from '../Shared/types';
import { useState, useEffect } from 'react';
import { useSearchParams, Link, useLoaderData } from 'react-router-dom';
import { formatExperienceRange } from '../Shared/dateUtils';

// Component shows all experiences
export default function Experiences() {
    // Load in my experiences
    const { allExperiences } = useLoaderData() as { allExperiences: ExperienceObject[] }

    // This creates my array of skills for filters by looping through my experiences and grabbing unique skills
    // I split this into professional and personal so that I can filter accordingly
    let profSkills: string[] = []
    let personalSkills: string[] = []

    for (const experience of allExperiences) {
        for (const skill of experience.skills) {
            if (!profSkills.includes(skill) && (experience.typeEx === "Professional" || experience.typeEx == "Education")) {
                profSkills.push(skill);
            } else if (!personalSkills.includes(skill) && experience.typeEx === "Personal") {
                personalSkills.push(skill);
            }
        }
    }

    // Search params for users going to professional or personal from dropdown
    const [searchParams] = useSearchParams();

    // State for whether I am showing personal or professional experiences
    const [proff, setProff] = useState(false);

    // State for filter
    const [filter, setFilter] = useState<string[]>([]);


    // State for search
    const [search, setSearch] = useState("");

    // This effect makes sure that when I switch between professional and personal, the filters and search get reset
    useEffect(() => {
        setFilter([]);
        setSearch("");
    }, [proff]);

    // This effect makes sure that when I reach /experiences through the dropdown, it sets to professional or personal correctly
    useEffect(() => {
        const type = searchParams.get('type');
        setProff(type === 'personal');
    }, [searchParams]);

    return (
        <div>
            <section>
                <div className="px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-4 md:space-y-8">
                        <div>
                            <div className="flex gap-4 justify-between">
                                <div className="flex gap-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl mb-5">
                                        {proff ? "Personal" : "Professional"} Experiences
                                    </h2>

                                    {/* Toggle for whether I'm showing professional or personal experiences */}
                                    <div className="p-2">
                                        <ProffToggle
                                            value={proff}
                                            onChange={setProff}
                                        />
                                    </div>
                                </div>

                                {/* Search bar for experiences */}
                                <div className="p-2 flex-grow max-w-md">
                                    <SearchBar
                                        search={search}
                                        setSearch={setSearch}
                                    />
                                </div>
                            </div>

                            {/* Filter for skills*/}
                            <div>
                                {proff ?
                                    <Filter
                                        skills={personalSkills}
                                        filter={filter}
                                        setFilter={setFilter}
                                    />
                                    :
                                    <Filter
                                        skills={profSkills}
                                        filter={filter}
                                        setFilter={setFilter}
                                    />
                                }
                            </div>
                        </div>
                        {/* Grid of cards */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                            {/* Filter my experiences according and then map them to a card */}
                            {allExperiences
                                .filter((experience) => {
                                    // Filter by experience type based on toggle
                                    const matchesType = proff
                                        ? experience.typeEx === "Personal"
                                        : experience.typeEx === "Professional" || experience.typeEx === "Education";

                                    // Filter by selected skills
                                    const matchesSkills =
                                        // If no filters are selected, show everything
                                        filter.length === 0 ||
                                        // Otherwise show if the experience has at least one filtered skill
                                        experience.skills.some((skill) => filter.includes(skill));

                                    // Filter by search
                                    const matchesSearch =
                                        // If there is nothing in the search bar, show everything
                                        search.trim() === "" ||
                                        // Otherwise, check if there is a match in any of the experience fields
                                        experience.typeEx.toLowerCase().includes(search.toLowerCase()) ||
                                        experience.position.toLowerCase().includes(search.toLowerCase()) ||
                                        experience.company.toLowerCase().includes(search.toLowerCase()) ||
                                        experience.startDate.toLowerCase().includes(search.toLowerCase()) ||
                                        experience.endDate.toLowerCase().includes(search.toLowerCase()) ||
                                        experience.highlights.some(h => h.toLowerCase().includes(search.toLowerCase())) ||
                                        experience.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))

                                    // Return if both matchesType matchesSkills and matchesSearch are true
                                    return matchesType && matchesSkills && matchesSearch;

                                })
                                .map(experience =>
                                    <article
                                        className="rounded-lg border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-lg sm:p-6"
                                    >
                                        <span className="inline-block rounded-sm bg-blue-600 p-2 text-white">
                                            {/* Professional experiences: Briefcase, Educational experiences: graduation cap, Personal experiences: Heart */}
                                            {experience.typeEx === "Professional" ? (
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l1.447.723.005.003.027.013.12.056c.108.05.272.123.486.212.429.177 1.056.416 1.834.655C7.481 13.524 9.63 14 12 14c2.372 0 4.52-.475 6.08-.956.78-.24 1.406-.478 1.835-.655a14.028 14.028 0 0 0 .606-.268l.027-.013.005-.002L22 11.381V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.447 7.894.553-.276V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.382l.553.276.002.002.004.002.013.006.041.02.151.07c.13.06.318.144.557.242.478.198 1.163.46 2.01.72C7.019 15.476 9.37 16 12 16c2.628 0 4.98-.525 6.67-1.044a22.95 22.95 0 0 0 2.01-.72 15.994 15.994 0 0 0 .707-.312l.041-.02.013-.006.004-.002.001-.001-.431-.866.432.865ZM12 10a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clipRule="evenodd" />
                                                </svg>
                                            ) : experience.typeEx === "Education" ? (
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12.4472 4.10557c-.2815-.14076-.6129-.14076-.8944 0L2.76981 8.49706l9.21949 4.39024L21 8.38195l-8.5528-4.27638Z" />
                                                    <path d="M5 17.2222v-5.448l6.5701 3.1286c.278.1325.6016.1293.8771-.0084L19 11.618v5.6042c0 .2857-.1229.5583-.3364.7481l-.0025.0022-.0041.0036-.0103.009-.0119.0101-.0181.0152c-.024.02-.0562.0462-.0965.0776-.0807.0627-.1942.1465-.3405.2441-.2926.195-.7171.4455-1.2736.6928C15.7905 19.5208 14.1527 20 12 20c-2.15265 0-3.79045-.4792-4.90614-.9751-.5565-.2473-.98098-.4978-1.27356-.6928-.14631-.0976-.2598-.1814-.34049-.2441-.04036-.0314-.07254-.0576-.09656-.0776-.01201-.01-.02198-.0185-.02991-.0253l-.01038-.009-.00404-.0036-.00174-.0015-.0008-.0007s-.00004 0 .00978-.0112l-.00009-.0012-.01043.0117C5.12215 17.7799 5 17.5079 5 17.2222Zm-3-6.8765 2 .9523V17c0 .5523-.44772 1-1 1s-1-.4477-1-1v-6.6543Z" />
                                                </svg>

                                            ) : (
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                                                </svg>

                                            )}
                                        </span>

                                        <a href="#">
                                            <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                                                {experience.position}
                                            </h3>
                                        </a>

                                        <div>
                                            <h2>{experience.company}</h2>
                                            <h2>
                                                {formatExperienceRange(experience.startDate, experience.endDate)}
                                            </h2>
                                        </div>

                                        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                                            <ul>
                                                {experience.highlights.map((highlight: string, idx: number) => (
                                                    <li key={idx}>{highlight}</li>
                                                ))}
                                            </ul>
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-1">
                                            {experience.skills.length > 0 ? experience.skills.map((skill: string, idx: number) =>
                                            (<span
                                                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                key={idx}
                                            >
                                                {skill}
                                            </span>)) : <span></span>}

                                        </div>


                                        <Link to={`/experiences/${experience._id}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                                            Find out more

                                            <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
                                                &rarr;
                                            </span>
                                        </Link>
                                    </article>)}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}