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
        url: "https://res.cloudinary.com/dzgha4azw/raw/upload/v1754145999/resume.pdf",
        public_id: "resume.pdf",
        uploadedAt: "08-02-2025"
    }
}

export default function Resume() {
    return (
        <div>
            <Header />
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-4 md:space-y-8">
                        <div className="max-w-xl">
                            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                My Resume
                            </h2>
                        </div>

                        <iframe
                            src={ExampleAbout.resume.url}
                            width="100%"
                            height="600px"
                            loading="lazy"
                            title="PDF-file"
                        >
                        </iframe>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}