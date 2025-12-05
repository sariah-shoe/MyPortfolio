import { Link, Form, useLoaderData, useNavigation } from "react-router-dom";
import type { AboutObject } from "../Shared/types";
import { useState, useEffect, useRef, useMemo } from "react";
import { useFormDirtyState } from "../../hooks/useFormDirtyState";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";
import { useAuth } from "../Shared/AuthContext";

export default function AboutChange() {
    // Loaded data
    const { aboutMeData } = useLoaderData() as { aboutMeData: AboutObject };

    // Navigation to help with unsaved change guard, toast, and form submission
    const navigation = useNavigation();

    // Toast state, showing or not
    const [showToast, setShowToast] = useState(false);

    // State to keep track of submissions
    const [wasSubmitting, setWasSubmitting] = useState(false);

    // Reset counter for dirty tracking
    const [resetCounter, setResetCounter] = useState(0);

    // States to help handle file previews
    const [headshot, setHeadshot] = useState(aboutMeData.headshot?.url);
    const [resume, setResume] = useState(aboutMeData.resume?.url);

    // Refs to keep track of the file input
    const headshotInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    // Refs to keep track of file preview
    const headshotPreviewRef = useRef<string | null>(null);
    const resumePreviewRef = useRef<string | null>(null);

    // Use auth
    const { auth } = useAuth();

    // Memoize baseline off loader data
    // Only blurb is memoized, dirty states for images are handled through childDirty
    const baseline = useMemo(() => ({
        blurb: aboutMeData.blurb ?? "",
    }), [aboutMeData.blurb]);

    // Use the useFormDirty state hook
    const { formRef, isDirty, childDirty } = useFormDirtyState({
        baseline,
        resetKey: resetCounter,
    });

    // Refs to help suppress guard during PUT saves and for our own redirect
    const savingRef = useRef(false);
    const guardBypassRef = useRef(false);

    // Use the useUnsavedChangesGuard hook
    useUnsavedChangesGuard({
        when: isDirty,
        names: ["About Me"],
        suppress: savingRef.current || guardBypassRef.current,
        onConfirm: (proceed) => {
            guardBypassRef.current = true; // bypass the guard when the user agrees to lose unsaved changes
            proceed();
            // navigate("/admin", { replace: true }); 
        },
    });

    // Effect to handle my wasSubmitting state
    useEffect(() => {
        if (navigation.state === "submitting" && navigation.formMethod?.toLowerCase() === "put") {
            setWasSubmitting(true);
        }
    }, [navigation.state, navigation.formMethod]);

    // Effect to handle toast
    useEffect(() => {
        // If we had made a submission and now we're done
        if (wasSubmitting && navigation.state === "idle") {
            // Have the toast show and set a timeout for it to go away
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset was submitting and my saving ref
            setWasSubmitting(false);
            savingRef.current = false;

            // Let the useFormDirtyState know that we are clean again
            setResetCounter(c => c + 1);
            
            // Clear file inputs
            if (headshotInputRef.current) headshotInputRef.current.value = "";
            if (resumeInputRef.current) resumeInputRef.current.value = "";

            // Clear file previews
            if (headshotPreviewRef.current){
                URL.revokeObjectURL(headshotPreviewRef.current);
                headshotPreviewRef.current = null;
            }

            if (resumePreviewRef.current){
                URL.revokeObjectURL(resumePreviewRef.current);
                resumePreviewRef.current = null;
            }

            // Re-seed files from server data
            setHeadshot(aboutMeData.headshot?.url);
            setResume(aboutMeData.resume?.url);
        }
    }, [navigation.state, wasSubmitting, aboutMeData]); // This should run whenever we get a change to our navigation, submission, or data

    // Handles headshot changes
    const onHeadshotChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        // Make sure there is a file and that it is not empty
        const f = e.currentTarget.files?.[0];
        if (!f || f.size === 0) return;

        // Revoke previous blob preview
        if (headshotPreviewRef.current) URL.revokeObjectURL(headshotPreviewRef.current);
        
        // Set new preview and mark as dirty
        const url = URL.createObjectURL(f);
        headshotPreviewRef.current = url;
        setHeadshot(url);
        childDirty(true);
    }

    // Handles resume changes
    const onResumeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        // Make sure there is a file and it is not empty
        const f = e.currentTarget.files?.[0];
        if (!f || f.size === 0) return;

        // Revoke previous blob preview
        if(resumePreviewRef.current) URL.revokeObjectURL(resumePreviewRef.current);

        // Set new preview and mark as dirty
        const url = URL.createObjectURL(f);
        resumePreviewRef.current = url;
        setResume(url);
        childDirty(true);
    }

    // The component itself
    return (
        <div>
            {/* My toast component that shows after a save */}
            {showToast && (
                <div role="status" className="fixed top-4 right-4 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
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

                            <p className="mt-0.5 text-sm text-gray-700">{"Your changes to about me have been saved."}
                            </p>
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

            {/* Title and nav */}
            <h2 className="mb-2 text-4xl font-bold text-gray-900">About Me</h2>
            <Link to="/admin" className="inline-block mt-2 text-xl font-semibold text-blue-700 hover:underline">
                Back to Admin
            </Link>

            {/* Form for changing data */}
            <Form
                className="max-w-sm mx-auto"
                action={`/admin/about`}
                method="put"
                encType="multipart/form-data"
                ref={formRef}
                onSubmit={() => {
                    savingRef.current = true; // suppress guard while the PUT goes out
                }}
            >
                {/* If there are unsaved changes to the form, display this warning at the top */}
                {isDirty && <div role="status" className="border-s-4 border-yellow-700 bg-yellow-50 p-4">
                    <div className="flex items-center gap-2 text-yellow-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path
                                fillRule="evenodd"
                                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>

                        <strong className="font-medium"> Unsaved Changes </strong>
                    </div>

                    <p className="mt-2 text-sm text-yellow-700">
                        You have made changes to the about me information. If you do not save, you will lose your changes when you navigate away.
                    </p>
                </div>}
                
                {/* The about me blurb input */}
                <div className="mb-5 mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        About Me Text
                        <textarea
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            rows={10}
                            defaultValue={aboutMeData.blurb ?? ""}
                            name="blurb"
                            maxLength={1000}
                        />
                    </label>
                </div>

                {/* Headshot input and preview */}
                <div className="mb-5">
                    {headshot ? (<img src={headshot} alt="Headshot of Sariah Shoemaker" />) : <div className="h-32 w-32 bg-gray-100 rounded-md grid place-items-center text-sm text-gray-500">
                        No headshot
                    </div>}
                    <label htmlFor="headshotFile" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium">Upload New Headshot</span>
                            {/* …icon… */}
                        </div>
                        <input
                            ref={headshotInputRef}
                            type="file"
                            id="headshotFile"
                            name="headshotFile"
                            className="sr-only"
                            accept="image/*"
                            onChange={onHeadshotChange}
                        />
                    </label>
                </div>

                {/* Resume input and preview */}
                <div className="mb-5">
                    {resume ?
                        (<iframe
                            src={resume}
                            width="100%"
                            height="600px"
                            loading="lazy"
                            title="PDF-file"
                        />) :
                        <div className="p-3 border rounded text-sm text-gray-500">
                            No resume uploaded
                        </div>
                    }
                    <label htmlFor="resumeFile" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium">Upload New Resume</span>
                        </div>
                        <input
                            ref={resumeInputRef}
                            type="file"
                            id="resumeFile"
                            name="resumeFile"
                            className="sr-only"
                            accept=".pdf"
                            onChange={onResumeChange}
                        />
                    </label>
                </div>

                {/* Submission button, disabled if not authenticated */}
                <div className="mb-5">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-700"
                        disabled={!auth}
                    >
                        Save
                    </button>
                </div>
            </Form>
            
            {/* Navigation to admin at bottom of page */}
            <Link to="/admin" className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline">
                Back to Admin
            </Link>
        </div>
    );
}
