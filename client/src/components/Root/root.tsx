import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import type { AboutObject } from '../Shared/types';

const ExampleAbout: AboutObject = {
    headshot: {
        type: 'image',
        url: "https://res.cloudinary.com/dzgha4azw/image/upload/v1754077186/main-sample.png",
        public_id: "main-sample",
        uploadedAt: "08-01-2025",
    },
    blurb: "Hello! I am Sariah Shoemaker and welcome to my portfolio. This was built using a MERN stack and highlights my personal and professional acheivements. Take a look around and feel free to reach out!",
    resume: {
        type: 'pdf',
        url: "PDF URL",
        public_id: "whatever it is",
        uploadedAt: "08-01-2025"
    }
}

export default function Root() {
    return (
        <div>
            <Header />
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
                        <div className="md:col-span-3">
                            <img
                                src={ExampleAbout.headshot.url}
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
                                    {ExampleAbout.blurb}
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