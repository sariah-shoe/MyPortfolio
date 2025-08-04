import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import { useLoaderData } from 'react-router-dom';
import type { AboutObject } from '../Shared/types';

export default function Root() {
    const { aboutMeData } = useLoaderData() as {aboutMeData: AboutObject};
    return (
        <div>
            <Header />
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                        <div className="md:col-span-3">
                            <img
                                src={aboutMeData.headshot.url}
                                className="rounded"
                                alt=""
                            />
                        </div>

                        <div className="md:col-span-1">
                            <div className="max-w-lg md:max-w-none">
                                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                    Sariah Shoemaker
                                </h2>

                                <p className="mt-4 text-gray-700">
                                    {aboutMeData.blurb}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}