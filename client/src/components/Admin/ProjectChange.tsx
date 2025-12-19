import List from "./List.tsx";
import type { ProjectObject } from "../Shared/types.ts";
import { Form, useNavigation } from "react-router-dom";
import FileListEditor from "./FileListEditor.tsx";
import { useFormDirtyState } from "../../hooks/useFormDirtyState.ts";
import { useMemo } from "react";
import { useAuth } from "../Shared/AuthContext.tsx";

interface ProjectProps {
  project: ProjectObject;
  onSubmitStart?: (position: string) => void;
  onDangerousSubmit?: () => void;
  onDirtyChange?: (id: string, isDirty: boolean) => void;
  resetKey?: number;
}

export default function ProjectChange({
  project,
  onSubmitStart,
  onDirtyChange,
  onDangerousSubmit,
  resetKey,
}: ProjectProps) {
  const { auth } = useAuth();

  const baseline = useMemo(
    () => ({
      name: project.name ?? "",
      gitLink: project.gitLink ?? "",
      startDate: project.startDate?.slice(0, 10) ?? "",
      endDate: project.endDate?.slice(0, 10) ?? "",
      extra: project.extra ?? "",
    }),
    [
      project.name,
      project.gitLink,
      project.startDate,
      project.endDate,
      project.extra,
    ],
  );

  const { formRef, isDirty, childDirty } = useFormDirtyState({
    baseline,
    resetKey,
    onDirtyChange: (dirty) => onDirtyChange?.(project._id, dirty),
  });

  // Loading overlay state (for this specific card only)
  const navigation = useNavigation();
  const targetAction = `/admin/projects/${project._id}`;
  const isThisCardSubmitting =
    navigation.state === "submitting" &&
    (navigation.formAction?.endsWith(targetAction) ?? false);

  const method = navigation.formMethod?.toLowerCase();
  const isSaving = isThisCardSubmitting && method === "put";
  const isDeleting = isThisCardSubmitting && method === "delete";
  const isBusy = isSaving || isDeleting;

  const overlayMessage = isDeleting ? "Deleting project…" : "Saving project…";

  return (
    <div
      className="relative p-6 bg-white rounded-lg shadow space-y-4"
      aria-busy={isBusy}
    >
      {/* Full-card dimmer overlay */}
      {isBusy && (
        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm pointer-events-none" />
      )}

      {/* Sticky status banner (visible regardless of scroll) */}
      {isBusy && (
        <div
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-full bg-gray-900 text-white/90 px-4 py-2 shadow-lg">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-sm font-medium">{overlayMessage}</span>
          </div>
        </div>
      )}

      {/* Delete form */}
      <Form
        method="delete"
        action={`/admin/projects/${project._id}`}
        onSubmit={(e) => {
          if (!window.confirm("Delete this project?")) {
            e.preventDefault();
            return;
          }
          onDangerousSubmit?.();
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-700"
          disabled={isBusy || !auth}
        >
          Delete project
        </button>
      </Form>

      {/* Save form */}
      <Form
        method="put"
        encType="multipart/form-data"
        action={`/admin/projects/${project._id}`}
        onSubmit={() => onSubmitStart?.(project.name)}
        ref={formRef}
      >
        <fieldset disabled={isBusy} className={isBusy ? "pointer-events-none" : undefined}>
          {isDirty && (
            <div role="alert" className="border-s-4 border-yellow-700 bg-yellow-50 p-4">
              <div className="flex items-center gap-2 text-yellow-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>

                <strong className="font-medium"> Unsaved Changes </strong>
              </div>

              <p className="mt-2 text-sm text-yellow-700">
                You have made changes to this project. If you do not save the project, you will lose your changes when you navigate away.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`name-${project._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id={`name-${project._id}`}
                name="name"
                defaultValue={project.name}
                required
                maxLength={100}
                className="rounded border border-gray-300 p-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor={`startDate-${project._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                id={`startDate-${project._id}`}
                name="startDate"
                type="date"
                required
                defaultValue={project.startDate?.slice(0, 10) ?? ""}
                className="rounded border border-gray-300 p-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor={`endDate-${project._id}`}
                className="text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                id={`endDate-${project._id}`}
                name="endDate"
                type="date"
                defaultValue={project.endDate?.slice(0, 10) ?? ""}
                className="rounded border border-gray-300 p-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor={`git-${project._id}`}
                className="text-sm font-medium text-gray-700"
              >
                GitHub Link
              </label>
              <input
                id={`git-${project._id}`}
                name="gitLink"
                type="text"
                defaultValue={project.gitLink}
                className="rounded border border-gray-300 p-2"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Highlights:</h3>
            <List
              name="highlights"
              initialItems={project.highlights}
              onDirty={(dirty) => childDirty(dirty)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Skills:</h3>
            <List
              name="skills"
              initialItems={project.skills}
              onDirty={(dirty) => childDirty(dirty)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Images:</h3>
            <FileListEditor initialFiles={project.images} resetKey={resetKey} onDirty={(dirty) => childDirty(dirty)} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor={`extra-${project._id}`}>Extra</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue={project.extra}
              name="extra"
              id={`extra-${project._id}`}
              maxLength={2000}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-700"
            disabled={!auth}
          >
            Save
          </button>
        </fieldset>
      </Form>
    </div>
  );
}
