import { useLoaderData } from "react-router-dom";
import type { AboutObject } from "../Shared/types";

export default function AboutMe() {
    // Load the about me data
    const { aboutMeData } = useLoaderData() as {aboutMeData: AboutObject};

    // The component itself
    return(
    <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                {/* The image if there is one */}
                <div className="md:col-span-2 flex items-center justify-center">
                    {aboutMeData.headshot ? <img
                        src={aboutMeData.headshot.url}
                        className="rounded max-h-[80vh] object-contain"
                        alt=""
                    /> : "No Image Found"}
                </div>
                
                {/* My intro blurb */}
                <div className="md:col-span-2">
                    <div className="max-w-lg md:max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                            Sariah Shoemaker
                        </h2>

                        <p className="mt-4 text-gray-700">
                            {aboutMeData.blurb ? aboutMeData.blurb : "No Blurb Found"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>)
}