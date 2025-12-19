import Filter from '../Shared/Filter';
import SearchBar from '../Shared/SearchBar';
import type { ProjectObject } from '../Shared/types';
import { useState, useMemo } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { formatExperienceRange } from '../Shared/dateUtils';
import { getSortDate } from '../Shared/dateSorter';

export default function Projects() {
    // Load in my projects
    const { allProjects } = useLoaderData() as { allProjects: ProjectObject[] }

    // This creates my array of skills for filters by looping through my projects and grabbing unique skills
    // Memoized because we only want it to change when allProjects does
    const skills = useMemo(() => {
        const unique = new Set<string>();
        for (const project of allProjects) {
            project.skills.forEach((skill) => unique.add(skill));
        }
        return Array.from(unique).sort();
    }, [allProjects]);


    // State for filter
    const [filter, setFilter] = useState<string[]>([]);

    // State for sort
    const [sortBy, setSortBy] = useState<
        "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc"
    >("date-desc");

    // State for search
    const [search, setSearch] = useState("");

    return (
        <div>
            <section>
                <div className="px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-4 md:space-y-8">
                        <div>
                            <div className="flex gap-4 justify-between">
                                <div className="flex gap-4">
                                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl mb-5">
                                        My Projects
                                    </h1>
                                </div>

                                {/* Search bar for experiences */}
                                <div className="p-2 flex-grow max-w-md">
                                    <SearchBar
                                        search={search}
                                        setSearch={setSearch}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Filter for skills*/}
                                <div>
                                    <Filter
                                        skills={skills}
                                        filter={filter}
                                        setFilter={setFilter}
                                    />

                                </div>

                                {/* Sort dropdown */}
                                <div className="p-2">
                                    <label className="mr-2 text-sm text-gray-700" htmlFor="sortBy">
                                        Sort by
                                    </label>
                                    <select
                                        id="sortBy"
                                        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value as
                                                | "date-desc"
                                                | "date-asc"
                                                | "alpha-asc"
                                                | "alpha-desc")
                                        }
                                    >
                                        <option value="date-desc">Newest first</option>
                                        <option value="date-asc">Oldest first</option>
                                        <option value="alpha-asc">Position A → Z</option>
                                        <option value="alpha-desc">Position Z → A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* Grid of cards */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                            {/* Filter my experiences according and then map them to a card */}
                            {allProjects
                                .filter((project) => {
                                    // Filter by selected skills
                                    const matchesSkills =
                                        // If no filters are selected, show everything
                                        filter.length === 0 ||
                                        // Otherwise show if the experience has at least one filtered skill
                                        project.skills.some((skill) => filter.includes(skill));

                                    // Filter by search
                                    const matchesSearch =
                                        // If there is nothing in the search bar, show everything
                                        search.trim() === "" ||
                                        // Otherwise, check if there is a match in any of the experience fields
                                        project.name.toLowerCase().includes(search.toLowerCase()) ||
                                        project.startDate.toLowerCase().includes(search.toLowerCase()) ||
                                        project.endDate?.toLowerCase().includes(search.toLowerCase()) ||
                                        project.highlights?.some(h => h.toLowerCase().includes(search.toLowerCase())) ||
                                        project.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))

                                    // Return if both matchesType matchesSkills and matchesSearch are true
                                    return matchesSkills && matchesSearch;

                                })
                                .sort((a, b) => {
                                    switch (sortBy) {
                                        case "date-asc":
                                            return getSortDate(a) - getSortDate(b); // oldest first
                                        case "date-desc":
                                            return getSortDate(b) - getSortDate(a); // newest first
                                        case "alpha-asc":
                                            return a.name.localeCompare(b.name, "en", {
                                                sensitivity: "base",
                                            });
                                        case "alpha-desc":
                                            return b.name.localeCompare(a.name, "en", {
                                                sensitivity: "base",
                                            });
                                        default:
                                            return 0;
                                    }
                                })
                                .map(project =>
                                    <article
                                        key={project._id}
                                        className="rounded-lg border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-lg sm:p-6"
                                    >
                                        <span className="inline-block rounded-sm bg-blue-600 p-2 text-white">
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M7.05 4.05A7 7 0 0 1 19 9c0 2.407-1.197 3.874-2.186 5.084l-.04.048C15.77 15.362 15 16.34 15 18a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1c0-1.612-.77-2.613-1.78-3.875l-.045-.056C6.193 12.842 5 11.352 5 9a7 7 0 0 1 2.05-4.95ZM9 21a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm1.586-13.414A2 2 0 0 1 12 7a1 1 0 1 0 0-2 4 4 0 0 0-4 4 1 1 0 0 0 2 0 2 2 0 0 1 .586-1.414Z" clipRule="evenodd" />
                                            </svg>

                                        </span>

                                        <h2 className="mt-0.5 text-lg font-medium text-gray-900">
                                            {project.name}
                                        </h2>

                                        <div>
                                            <p>
                                                {formatExperienceRange(project.startDate, project.endDate)}
                                            </p>
                                        </div>

                                        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                                            {project?.extra}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-1">
                                            {project.skills.length > 0 ? project.skills.map((skill: string) =>
                                            (<span
                                                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                key={skill}
                                            >
                                                {skill}
                                            </span>)) : <span></span>}

                                        </div>


                                        <Link to={`/projects/${project._id}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
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