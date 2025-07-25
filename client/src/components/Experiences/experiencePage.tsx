import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import CustomCarousel from '../Shared/CustomCarousel';



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

export default function ExperiencePage() {
    return (
        <div>
            <Header />
            {/* This section holds the basic information, a carousel if there are images, and a blurb about what I did there */}
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    {experience.images.length == 0 ?
                        <div className="max-w-lg md:max-w-none">
                            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                {experience.position} at {experience.company}
                            </h2>

                            <h3 className="mt-1 text-base text-gray-700 sm:text-lg">{experience.startDate} {experience.typeEx === "Personal" ? "" : experience.endDate !== "" ? ` to ${experience.endDate}` : " to present"}</h3>

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

                                    <h3 className="mt-1 text-base text-gray-700 sm:text-lg">{experience.startDate} {experience.typeEx === "Personal" ? "" : experience.endDate !== "" ? ` to ${experience.endDate}` : " to present"}</h3>

                                    <p className="mt-4 text-sm text-gray-600 sm:text-base">
                                        {experience.extra}
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                {experience.images.length != 0 &&
                                    <CustomCarousel
                                        images={experience.images}
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
                                    Highlights of my Experience
                                </h3>
                                <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {experience.highlights.map((highlight) => <li>{highlight}</li>)}
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
                                    {experience.skills.map((skill) => <li>{skill}</li>)}
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