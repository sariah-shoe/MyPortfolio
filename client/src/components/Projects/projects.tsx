import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import Filter from '../Shared/Filter';
import SearchBar from '../Shared/SearchBar';
import type { ProjectObject } from '../Shared/types';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export default function Projects() {
    const { allProjects } = useLoaderData() as { allProjects: ProjectObject[] }
    
    // This creates my array of skills for filters by looping through my projects and grabbing unique skills
    let skills: string[] = []

    for (const project of allProjects) {
        for (const skill of project.skills) {
            if (!skills.includes(skill)) {
                skills.push(skill);
            }
        }
    }

    // State for filter
    const [filter, setFilter] = useState<string[]>([]);

    // State for search
    const [search, setSearch] = useState("");

    return (
        <div>
            <Header />
            <section>
                <div className="px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-4 md:space-y-8">
                        <div>
                            <div className="flex gap-4 justify-between">
                                <div className="flex gap-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl mb-5">
                                        My Projects
                                    </h2>
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
                                <Filter
                                    skills={skills}
                                    filter={filter}
                                    setFilter={setFilter}
                                />

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
                                        project.endDate.toLowerCase().includes(search.toLowerCase()) ||
                                        project.highlights.some(h => h.toLowerCase().includes(search.toLowerCase())) ||
                                        project.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))

                                    // Return if both matchesType matchesSkills and matchesSearch are true
                                    return matchesSkills && matchesSearch;

                                })
                                .map(project =>
                                    <article
                                        className="rounded-lg border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-lg sm:p-6"
                                    >
                                        <span className="inline-block rounded-sm bg-blue-600 p-2 text-white">
                                            {/* SVG from here https://flowbite.com/icons */}
                                            {/* Lightbulb */}
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fill-rule="evenodd" d="M7.05 4.05A7 7 0 0 1 19 9c0 2.407-1.197 3.874-2.186 5.084l-.04.048C15.77 15.362 15 16.34 15 18a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1c0-1.612-.77-2.613-1.78-3.875l-.045-.056C6.193 12.842 5 11.352 5 9a7 7 0 0 1 2.05-4.95ZM9 21a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm1.586-13.414A2 2 0 0 1 12 7a1 1 0 1 0 0-2 4 4 0 0 0-4 4 1 1 0 0 0 2 0 2 2 0 0 1 .586-1.414Z" clip-rule="evenodd" />
                                            </svg>

                                        </span>

                                        <a href="#">
                                            <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                                                {project.name}
                                            </h3>
                                        </a>

                                        <div>
                                            <h2>
                                                {project.startDate}
                                                {project.endDate !== "" ? ` to ${project.endDate}` : " to present"}
                                            </h2>
                                        </div>

                                        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                                            <ul>
                                                {project.highlights.map((highlight: string, idx: number) => (
                                                    <li key={idx}>{highlight}</li>
                                                ))}
                                            </ul>
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-1">
                                            {project.skills.length > 0 ? project.skills.map((skill: string, idx: number) =>
                                            (<span
                                                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                key={idx}
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
            <Footer />
        </div>
    );
}