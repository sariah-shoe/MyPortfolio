import { Link, Form, useLoaderData, useNavigation } from "react-router-dom"
import type { AboutObject } from "../Shared/types";
import { useState, useEffect } from "react";

export default function AboutChange() {
    const { aboutMeData } = useLoaderData() as { aboutMeData: AboutObject };
    const navigation = useNavigation();
    const [showToast, setShowToast] = useState(false);
    const [wasSubmitting, setWasSubmitting] = useState(false);

    useEffect(() => {
        if (navigation.state === "submitting" && navigation.formMethod?.toLowerCase() === "put") {
            setWasSubmitting(true);
        }

        if (wasSubmitting && navigation.state === "idle") {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setWasSubmitting(false); // reset
        }
    }, [navigation.state, navigation.formMethod, wasSubmitting]);

    return (
        <div>
            {showToast && (
                <div role="alert" className="fixed top-4 right-4 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 text-green-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        <div className="flex-1">
                            <strong className="font-medium text-gray-900"> Changes saved </strong>

                            <p className="mt-0.5 text-sm text-gray-700">Your About Me changes have been saved.</p>
                        </div>

                        <button
                            className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            type="button"
                            aria-label="Dismiss alert"
                            onClick={() => setShowToast(false)}
                        >
                            <span className="sr-only">Dismiss popup</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">About Me</h2>
            <Form
                className="max-w-sm mx-auto"
                action={`/admin/about`} method={'put'}
            >
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        About Me Text
                        <textarea
                            id="base-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            rows={10}
                            defaultValue={aboutMeData.blurb}
                            name="blurb"
                        />
                    </label>
                </div>
                <div className="mb-5">
                    <img
                        src={aboutMeData.headshot.url}
                        alt=""
                    />
                    <label htmlFor="File" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium"> Upload New Headshot </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                                />
                            </svg>
                        </div>

                        <input multiple type="file" id="File" className="sr-only" />
                    </label>
                </div>
                <div className="mb-5">
                    <iframe
                        src={aboutMeData.resume.url}
                        width="100%"
                        height="600px"
                        loading="lazy"
                        title="PDF-file"
                    ></iframe>
                    <label htmlFor="File" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium"> Upload New Resume </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                                />
                            </svg>
                        </div>

                        <input multiple type="file" id="File" className="sr-only" />
                    </label>
                </div>
                <div className="mb-5">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                </div>
            </Form>
            <Link to={"/admin"} className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">Back to Admin</Link>
        </div>
    )
}