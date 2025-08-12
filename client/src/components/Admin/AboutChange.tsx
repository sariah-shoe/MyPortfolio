// AboutChange.tsx
import { Link, Form, useLoaderData, useNavigation, useNavigate } from "react-router-dom";
import type { AboutObject } from "../Shared/types";
import { useState, useEffect, useRef } from "react";
import { useFormDirtyState } from "../../hooks/useFormDirtyState";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";

export default function AboutChange() {
    const { aboutMeData } = useLoaderData() as { aboutMeData: AboutObject };
    const navigation = useNavigation();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [wasSubmitting, setWasSubmitting] = useState(false);

    // ---- form-level dirty tracking
    const baseline = {
        blurb: aboutMeData.blurb ?? "",
        // If you later want to include uploads, add stable fields here,
        // e.g. headshotId: aboutMeData.headshot?.id ?? "", resumeId: aboutMeData.resume?.id ?? ""
    };
    const { formRef, isDirty, childDirty } = useFormDirtyState({
        baseline,
        // no onDirtyChange map needed since this page has a single form;
        // the guard just uses `isDirty` directly
    });

    // ---- suppress guard during PUT saves and for our own redirect
    const savingRef = useRef(false);
    const guardBypassRef = useRef(false);

    useUnsavedChangesGuard({
        when: isDirty,
        names: ["About Me"],
        suppress: savingRef.current || guardBypassRef.current,
        onConfirm: () => {
            guardBypassRef.current = true;          // bypass the guard for our own nav
            navigate("/admin", { replace: true });  // your desired destination
        },
    });

    // existing toast + reset of savingRef after save completes
    useEffect(() => {
        if (navigation.state === "submitting" && navigation.formMethod?.toLowerCase() === "put") {
            setWasSubmitting(true);
        }
    }, [navigation.state, navigation.formMethod]);

    useEffect(() => {
        if (wasSubmitting && navigation.state === "idle") {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setWasSubmitting(false);
            savingRef.current = false; // allow guard again
        }
    }, [navigation.state, wasSubmitting]);

    return (
        <div>
            {showToast && (
                <div role="status" className="fixed top-4 right-4 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                        {/* …icon… */}
                        <div className="flex-1">
                            <strong className="font-medium text-gray-900">Changes saved</strong>
                            <p className="mt-0.5 text-sm text-gray-700">Your About Me changes have been saved.</p>
                        </div>
                        {/* …dismiss button… */}
                    </div>
                </div>
            )}

            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">About Me</h2>
            <Link to="/admin" className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline">
                Back to Admin
            </Link>

            <Form
                className="max-w-sm mx-auto"
                action={`/admin/about`}
                method="put"
                ref={formRef}
                onSubmit={() => {
                    savingRef.current = true; // suppress guard while the PUT goes out
                }}
            >
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

                <div className="mb-5 mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        About Me Text
                        <textarea
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            rows={10}
                            defaultValue={aboutMeData.blurb}
                            name="blurb"
                            maxLength={1000}
                        />
                    </label>
                </div>

                <div className="mb-5">
                    <img src={aboutMeData.headshot.url} alt="" />
                    <label htmlFor="HeadshotFile" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium">Upload New Headshot</span>
                            {/* …icon… */}
                        </div>
                        <input
                            multiple
                            type="file"
                            id="HeadshotFile"
                            name="headshot"
                            className="sr-only"
                            onChange={() => childDirty(true)}
                        />
                    </label>
                </div>

                <div className="mb-5">
                    <iframe
                        src={aboutMeData.resume.url}
                        width="100%"
                        height="600px"
                        loading="lazy"
                        title="PDF-file"
                    />
                    <label htmlFor="ResumeFile" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                        <div className="flex items-center justify-center gap-4">
                            <span className="font-medium">Upload New Resume</span>
                            {/* …icon… */}
                        </div>
                        <input
                            multiple
                            type="file"
                            id="ResumeFile"
                            name="resume"
                            className="sr-only"
                            onChange={() => childDirty(true)}
                        />
                    </label>
                </div>

                <div className="mb-5">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </Form>

            <Link to="/admin" className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline">
                Back to Admin
            </Link>
        </div>
    );
}
