import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import { Form } from 'react-router-dom';

export default function Contact() {
    return (
        <div>
            <div className="flex flex-col">
                <div className="flex justify-center mt-4">
                    <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                        Contact Me
                    </h2>
                </div>
                <div className="flex justify-center mt-4">
                    <Form className="space-y-6 max-w-xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col">
                                First Name
                                <input
                                    className="p-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                    type="text"
                                />
                            </label>
                            <label className="flex flex-col">
                                Last Name
                                <input
                                    className="p-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                    type="text"
                                />
                            </label>
                        </div>

                        <label className="flex flex-col">
                            Email Address
                            <input
                                className="p-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                type="email"
                            />
                        </label>

                        <label className="flex flex-col">
                            Message
                            <textarea
                                rows={4}
                                className="p-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <button className="w-full rounded-md border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 transition">
                            Submit
                        </button>
                    </Form>

                </div>
            </div>
        </div>
    );
}