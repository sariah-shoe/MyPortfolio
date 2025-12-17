import { Link, useLoaderData, Form, useNavigation } from "react-router-dom";
import ProjectChange from "./ProjectChange";
import type { ProjectObject } from "../Shared/types";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";
import { useAuth } from "../Shared/AuthContext";
import { getSortDate } from "../Shared/dateSorter";

export default function ProjectCards() {
    // Load data
    const { allProjects } = useLoaderData() as { allProjects: ProjectObject[] }

    // Navigation to help with unsaved change guard, toast, and form submission
    const navigation = useNavigation();

    // Toast state, showing or not
    const [showToast, setShowToast] = useState(false);

    // State to keep track of submissions
    const [wasSubmitting, setWasSubmitting] = useState(false);

    // Keeps track of last edited so that we can display which project was saved
    const [lastEdited, setLastEdited] = useState<string | null>(null);
    const lastEditedRef = useRef<string | null>(null);

    // Keep track of dirty projects
    const [dirtyProjects, setDirtyProjects] = useState<Record<string, boolean>>({});

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
            setResetCounter(c => c + 1);

            // Set the last edited ref for popups
            setLastEdited(lastEditedRef.current);

            // Show the toast and set a timeout for it
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset was submitting and savingref
            setWasSubmitting(false);
            savingRef.current = false;
        }
    }, [navigation.state, wasSubmitting]);

    // If there's a change to a cards dirty/clean state, pass it on to the children
    const handleDirtyChange = useCallback((id: string, isDirty: boolean) => {
        const run = () => {
            // Change dirty projects state to match
            setDirtyProjects(prev => (prev[id] === isDirty ? prev : { ...prev, [id]: isDirty }));
        };
        // Run the changes as a microtask or as a promise
        if (typeof queueMicrotask === "function") {
            queueMicrotask(run);
        } else {
            Promise.resolve().then(run);
        }
    }, []);

    // Ids of currently dirty projects
    const dirtyIds = useMemo(
        () => Object.entries(dirtyProjects).filter(([, v]) => v).map(([id]) => id),
        [dirtyProjects]
    );

    // Names of currently dirty projects
    const dirtyNames = useMemo(() => {
        // Map ids to name
        return dirtyIds
            .map(id => {
                const ex = allProjects.find(e => e._id === id);
                return ex?.name || "Untitled Project";
            })
            .filter(Boolean);
    }, [dirtyIds, allProjects]);

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
    const filteredProjects = useMemo(
        () =>
            allProjects.filter((project) => {
                if (!search.trim()) return true;
                const q = search.toLowerCase();

                return (
                    project.name.toLowerCase().includes(q) ||
                    project.startDate.toLowerCase().includes(q) ||
                    project.endDate.toLowerCase().includes(q) ||
                    project.highlights.some((h) => h.toLowerCase().includes(q)) ||
                    project.skills.some((s) => s.toLowerCase().includes(q)) ||
                    project.gitLink.toLowerCase().includes(q) ||
                    project.extra.toLowerCase().includes(q)
                );
            }),
        [allProjects, search]
    )

    // Combine my search filtered list with a list of dirty cards then sort
    // I chose to have this combine with the dirty cards so the user doesn't "lose" cards with unsaved changes
    const visibleProjects = useMemo(() => {
        const dirtySet = new Set(dirtyIds);
        const combined: ProjectObject[] = [];

        // Add all my dirty projects
        for (const project of allProjects) {
            if (dirtySet.has(project._id)) {
                combined.push(project);
            }
        }

        // Add my filtered clean projects
        for (const project of filteredProjects) {
            if (!dirtySet.has(project._id)) {
                combined.push(project);
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
                    return a.name.localeCompare(b.name, "en", {
                        sensitivity: "base",
                    });
                case "alpha-desc":
                    return b.name.localeCompare(a.name, "en", {
                        sensitivity: "base",
                    });
                default:
                    return 0;
            }
        });
    }, [allProjects, filteredProjects, dirtyIds, sortBy])

    return (
        <div className="px-6 py-4">
            {/* Toast */}
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
                                : "Your project changes have been saved."}
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
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900">Projects</h2>
            <Link
                to={"/admin"}
                className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
            <div className="space-y-6">
                {/* Controls row */}
                <div className="mt-4 mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <label htmlFor="project-search" className="text-sm text-gray-700">
                            Search
                        </label>
                        <input
                            id="project-search"
                            type="text"
                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="project-sort" className="text-sm text-gray-700">
                            Sort by
                        </label>
                        <select
                            id="project-sort"
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

                {/* Option to add project */}
                <Form
                    method="POST"
                    action={`/admin/projects`}
                    onSubmit={() => { savingRef.current = true; }}
                >
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-700"
                        disabled={!auth}
                    >
                        Add Project
                    </button>
                </Form>
                
                {/* Map the cards themselves */}
                {visibleProjects.map((project) =>
                    <ProjectChange
                        key={project._id}
                        project={project}
                        resetKey={lastSavedIdRef.current === project._id ? resetCounter : undefined}
                        onSubmitStart={(position) => {
                            lastEditedRef.current = position;
                            lastSavedIdRef.current = project._id;
                            savingRef.current = true;
                        }}
                        onDirtyChange={handleDirtyChange}
                        onDangerousSubmit={() => { savingRef.current = true; }}
                    />
                )}

                {/* Add project */}
                <Form
                    method="POST"
                    action={`/admin/projects`}
                    onSubmit={() => { savingRef.current = true; }}
                >
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-700"
                        disabled={!auth}
                    >
                        Add Project
                    </button>
                </Form>
            </div>
            <Link
                to={"/admin"}
                className="inline-block mt-8 text-xl font-semibold text-blue-700 hover:underline"
            >
                Back to Admin
            </Link>
        </div>
    )
}