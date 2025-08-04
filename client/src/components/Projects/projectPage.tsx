import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import CustomCarousel from '../Shared/CustomCarousel';
import type { ProjectObject } from '../Shared/types';

const project:ProjectObject =
{
    name: "Wordle Clone",
    startDate: "01-2023",
    endDate: "01-2023",
    highlights: ["Learned how to make a GUI using Python", "Created logic for thing"],
    skills: ["Python", "Tkinter"],
    images: [],
    extra: "I created this for one of my classes, Intro to Programming 2",
    gitLink: "https://github.com/sariah-shoe/Worlde-Clone",
    replitLink: "https://replit.com/@sariahshoe/Worlde-Clone?embed=true"
}

export default function ProjectPage() {
    return (
        <div>
            <Header />
            {/* This section holds the basic information, a carousel if there are images, and a blurb about what I did there */}
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    {project.images.length == 0 ?
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                            <div className="md:col-span-1 md:mr-6">
                                <div className="max-w-lg md:max-w-none">
                                    <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                        {project.name}
                                    </h2>

                                    <h3 className="mt-1 text-base text-gray-700 sm:text-lg">
                                        {project.startDate} {project.endDate === project.startDate ? <></> : project.endDate !== "" ? ` to ${project.endDate}` : " to present"}
                                    </h3>

                                    <p className="mt-4 text-sm text-gray-600 sm:text-base">
                                        {project.extra}
                                    </p>
                                    <a href={project.gitLink} className="mt-4 text-sm text-gray-600 sm:text-base">Github Link</a>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <iframe
                                    src={project.replitLink}
                                    className="w-full h-[400px] rounded-lg border"
                                />
                            </div>
                        </div>

                        :

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                            <div className="md:col-span-1">
                                <div className="max-w-lg md:max-w-none">
                                    <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                        {project.name}
                                    </h2>

                                    <h3 className="mt-1 text-base text-gray-700 sm:text-lg">{project.startDate} {project.endDate !== "" ? ` to ${project.endDate}` : " to present"}</h3>

                                    <p className="mt-4 text-sm text-gray-600 sm:text-base">
                                        {project.extra}
                                    </p>

                                    <a href={project.gitLink}>Github Link</a>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                {project.images.length != 0 &&
                                    <CustomCarousel
                                        images={project.images.map((image) => image.url)}
                                    />
                                }
                            </div>
                        </div>}

                </div>
            </section>
            {/* This section holds two cards that show my highlights and skills */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mx-4 my-10 sm:mx-8 lg:mx-16">
                <div className="h-32">
                    <div className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                            <div className="mt-4 sm:mt-0">
                                <h3 className="text-lg font-medium text-pretty text-gray-900">
                                    Highlights of my project
                                </h3>
                                <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {project.highlights.map((highlight) => <li>{highlight}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-32">
                    <div className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                            <div className="mt-4 sm:mt-0">
                                <h3 className="text-lg font-medium text-pretty text-gray-900">
                                    Skills Learned and Used
                                </h3>
                                <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {project.skills.map((skill) => <li>{skill}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}