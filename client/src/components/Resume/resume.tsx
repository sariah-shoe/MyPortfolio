import type { AboutObject } from '../Shared/types';
import { useLoaderData } from 'react-router-dom';

export default function Resume() {
    const { aboutMeData } = useLoaderData() as { aboutMeData: AboutObject };
    return (
        <section aria-labelledby="resume-heading">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4 md:space-y-8">
                    <div className="max-w-xl">
                        <h1 id="resume-heading" className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                            My Resume
                        </h1>
                    </div>

                    {
                        aboutMeData.resume ?
                            <iframe
                                src={aboutMeData.resume.url}
                                width="100%"
                                height="600px"
                                loading="lazy"
                                title="Sariah Shoemaker resume (PDF)"
                                sandbox="allow-same-origin allow-scripts allow-downloads"
                                referrerPolicy="no-referrer"
                            >
                            </iframe>
                            : <p className="italic text-gray-500">
                                Resume not available at the moment.
                            </p>

                    }

                    <a
                        className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6"
                        href={aboutMeData.resume.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium"> Download Resume </span>

                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd" />
                                <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd" />
                            </svg>

                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}