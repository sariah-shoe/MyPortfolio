// ExperienceCards.tsx
import { Link, useLoaderData, Form, useNavigation } from "react-router-dom";
import ExperienceChange from "./ExperienceChange";
import type { ExperienceObject } from "../Shared/types";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";
import { useAuth } from "../Shared/AuthContext";
import { getSortDate } from "../Shared/dateSorter";

// Holds all my experiences

export default function ExperienceCards() {
    // Load data
    const { allExperiences } = useLoaderData() as { allExperiences: ExperienceObject[] }

    // Navigation to help with unsaved change guard, toast, and form submission
    const navigation = useNavigation();

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

    // States for search and sort
    const [search, setSearch] = useState("")
    type SortBy = "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc"
    const [sortBy, setSortBy] = useState<SortBy>("date-desc");

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
        // Change dirty experiences state to match
        setDirtyExperiences(prev => {
            if (prev[id] === isDirty) return prev;
            return { ...prev, [id]: isDirty };
        });
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

    // Filter the list by search
    const filteredExperiences = useMemo(
        () =>
            allExperiences.filter((ex) => {
                if (!search.trim()) return true;
                const q = search.toLowerCase();

                return (
                    ex.position.toLowerCase().includes(q) ||
                    ex.company.toLowerCase().includes(q) ||
                    ex.typeEx.toLowerCase().includes(q) ||
                    ex.startDate.toLowerCase().includes(q) ||
                    ex.endDate.toLowerCase().includes(q) ||
                    ex.highlights.some((h) => h.toLowerCase().includes(q)) ||
                    ex.skills.some((s) => s.toLowerCase().includes(q)) ||
                    ex.extra.toLowerCase().includes(q)
                );
            }),
        [allExperiences, search]
    )

    // Combine my search filtered list with a list of dirty cards then sort
    // I chose to have this combine with the dirty cards so the user doesn't "lose" cards with unsaved changes
    const visibleExperiences = useMemo(() => {
        const dirtySet = new Set(dirtyIds);
        const combined: ExperienceObject[] = [];

        // Add all my dirty experiences
        for (const ex of allExperiences) {
            if (dirtySet.has(ex._id)) {
                combined.push(ex);
            }
        }

        // Add my filtered clean experiences
        for (const ex of filteredExperiences) {
            if (!dirtySet.has(ex._id)) {
                combined.push(ex);
            }
        }

        // Sort the combined list
        return combined.sort((a, b) => {
            switch (sortBy) {
                case "date-asc":
                    return getSortDate(a) - getSortDate(b);
                case "date-desc":
                    return getSortDate(b) - getSortDate(a);
                case "alpha-asc":
                    return a.position.localeCompare(b.position, "en", {
                        sensitivity: "base",
                    });
                case "alpha-desc":
                    return b.position.localeCompare(a.position, "en", {
                        sensitivity: "base",
                    });
                default:
                    return 0;
            }
        });
    }, [allExperiences, filteredExperiences, dirtyIds, sortBy])

    // The component itself
    return (
        <div className="px-6 py-4">
            {/* Toast that shows after a save has happened */}
            {showToast && (
                <div role="alert" aria-live="assertive" className="fixed top-4 right-4 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
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
            <h1 className="mb-6 text-4xl font-extrabold text-gray-900">Experiences</h1>
            <Link
                to="/admin"
                className="inline-block text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>

            {/* Map all my experiences to individual cards */}
            <div className="space-y-6 mt-4">
                {/* Controls row */}
                <div className="mt-4 mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <label htmlFor="exp-search" className="text-sm text-gray-700">
                            Search
                        </label>
                        <input
                            id="exp-search"
                            type="text"
                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                            placeholder="Search experiences…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="exp-sort" className="text-sm text-gray-700">
                            Sort by
                        </label>
                        <select
                            id="exp-sort"
                            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value as SortBy)
                            }
                        >
                            <option value="date-desc">Newest first</option>
                            <option value="date-asc">Oldest first</option>
                            <option value="alpha-asc">Position A → Z</option>
                            <option value="alpha-desc">Position Z → A</option>
                        </select>
                    </div>
                </div>

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

                {visibleExperiences.map((experience) => (
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
