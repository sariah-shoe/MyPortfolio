import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import pdfFile from '../../assets/MyResume.pdf'

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
                            src={pdfFile}
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