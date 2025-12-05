// ExperienceCards.tsx
import { Link, useLoaderData, Form, useNavigation, useNavigate } from "react-router-dom";
import ExperienceChange from "./ExperienceChange";
import type { ExperienceObject } from "../Shared/types";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";
import { useAuth } from "../Shared/AuthContext";

// Holds all my experiences

export default function ExperienceCards() {
    // Load data
    const { allExperiences } = useLoaderData() as { allExperiences: ExperienceObject[] }

    // Navigation to help with unsaved change guard, toast, and form submission
    const navigation = useNavigation();
    const navigate = useNavigate();

    // Toast state, showing or not
    const [showToast, setShowToast] = useState(false);

    // State to keep track of submissions
    const [wasSubmitting, setWasSubmitting] = useState(false);

    // Keeps track of last edited so that we can display which experience was saved
    const [lastEdited, setLastEdited] = useState<string | null>(null);
    const lastEditedRef = useRef<string | null>(null);

    // Keeps track of dirty experiences
    const [dirtyExperiences, setDirtyExperiences] = useState<Record<string, boolean>>({});

    // Refs to help suppress guard during PUT saves and for our own redirect
    const savingRef = useRef(false);
    const guardBypassRef = useRef(false);

     // Reset counter for dirty tracking
    const [resetCounter, setResetCounter] = useState(0);
    const lastSavedIdRef = useRef<string | null>(null);

    // Use Auth
    const { auth } = useAuth();

    // Effect to handle my wasSubmitting state for toast
    useEffect(() => {
        if (navigation.state === "submitting" && navigation.formMethod?.toLowerCase() === "put") {
            setWasSubmitting(true);
        }
    }, [navigation.state, navigation.formMethod]);

    // Behavior after a save
    useEffect(() => {
        if (wasSubmitting && navigation.state === "idle") {
            // Make clean
            setResetCounter((c) => c + 1);

            // Set the last edited ref for popups
            setLastEdited(lastEditedRef.current);

            // Show the toast and set timeout for it
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset was submitting and savingref
            setWasSubmitting(false);
            savingRef.current = false;
        }
    }, [navigation.state, wasSubmitting]);

    // If there's a change to a cards dirty/clean status, pass it on to the children
    const handleDirtyChange = useCallback((id: string, isDirty: boolean) => {
        const run = () => {
            // Change dirty experiences state to match
            setDirtyExperiences(prev => {
                if (prev[id] === isDirty) return prev;
                return { ...prev, [id]: isDirty };
            });
        };
        // Run the changes as a microtask or as a promise
        if (typeof queueMicrotask === "function") {
            queueMicrotask(run);
        } else {
            Promise.resolve().then(run);
        }
    }, []);

    // Ids of currently dirty experiences
    const dirtyIds = useMemo(
        () => Object.entries(dirtyExperiences).filter(([, v]) => v).map(([id]) => id),
        [dirtyExperiences]
    );

    // Names of currently dirty experiences
    const dirtyNames = useMemo(() => {
        // Map ids to name
        return dirtyIds
            .map(id => {
                const ex = allExperiences.find(e => e._id === id);
                return ex?.position || ex?.company || "Untitled Experience";
            })
            .filter(Boolean);
    }, [dirtyIds, allExperiences]);

    // Use the useUnsavedChangesGuard hook
    useUnsavedChangesGuard({
        when: dirtyIds.length > 0,
        names: dirtyNames,
        suppress: savingRef.current || guardBypassRef.current,
        onConfirm: (proceed) => {
            guardBypassRef.current = true; // bypass the guard when the user agrees to lose unsaved changes
            proceed();
        },
    });

    // The component itself
    return (
        <div className="px-6 py-4">
            {/* Toast that shows after a save has happened */}
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

                            <p className="mt-0.5 text-sm text-gray-700">{lastEdited
                                ? `Your changes to "${lastEdited}" have been saved.`
                                : "Your experience changes have been saved."}
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

            {/* Titel and Nav */}
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">Experiences</h2>
            <Link
                to="/admin"
                className="inline-block text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>

            {/* Map all my experiences to individual cards */}
            <div className="space-y-6 mt-4">
                {allExperiences.map((experience) => (
                    <ExperienceChange
                        key={experience._id}
                        experience={experience}
                        resetKey={lastSavedIdRef.current === experience._id ? resetCounter : undefined}
                        onSubmitStart={(position) => {
                            lastEditedRef.current = position;
                            lastSavedIdRef.current = experience._id;
                            savingRef.current = true;
                        }}
                        onDangerousSubmit={() => { savingRef.current = true; }}
                        onDirtyChange={handleDirtyChange}
                    />
                ))}

                {/* Option to add experience */}
                <Form
                    method="POST"
                    action={`/admin/experiences`}
                    onSubmit={() => { savingRef.current = true; }}
                >
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-700"
                        disabled={!auth}
                    >
                        Add Experience
                    </button>
                </Form>
            </div>

            {/* Navigation to admin at bottom of page */}
            <Link
                to="/admin"
                className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
        </div>
    );
}
