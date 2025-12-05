// ExperienceChange.tsx
import List from "./List.tsx";
import type { ExperienceObject } from "../Shared/types.ts";
import { useFormDirtyState } from "../../hooks/useFormDirtyState.ts";
import { Form, useNavigation } from "react-router-dom";
import FileListEditor from "./FileListEditor.tsx";
import { useMemo } from "react";
import { useAuth } from "../Shared/AuthContext";

interface ExperienceProps {
  experience: ExperienceObject;
  resetKey?: number;
  onSubmitStart?: (position: string) => void;
  onDangerousSubmit?: () => void;
  onDirtyChange?: (id: string, isDirty: boolean) => void;
}

// Change one experience card

export default function ExperienceChange({
  experience,
  onSubmitStart,
  onDirtyChange,
  onDangerousSubmit,
  resetKey,
}: ExperienceProps) {
  // Use auth
  const { auth } = useAuth();

  // Baseline so we know if the card has changed
  const baseline = useMemo(
    () => ({
      position: experience.position ?? "",
      company: experience.company ?? "",
      startDate: experience.startDate?.slice(0, 10) ?? "",
      endDate: experience.endDate?.slice(0, 10) ?? "",
      extra: experience.extra ?? "",
    }),
    [
      experience.position,
      experience.company,
      experience.startDate,
      experience.endDate,
      experience.extra,
    ],
  );

  // Use my useFormDirtyState so we can keep track of changes
  const { formRef, isDirty, childDirty } = useFormDirtyState({
    baseline,
    resetKey,
    onDirtyChange: (dirty) => onDirtyChange?.(experience._id, dirty),
  });

  // Use navigation so I can deal with form submissions
  const navigation = useNavigation();

  // Set target action and method
  const targetAction = `/admin/experiences/${experience._id}`;
  const method = navigation.formMethod?.toLowerCase();

  // Track if a card is submitted, saving, deleting, or busy
  const isThisCardSubmitting =
    navigation.state === "submitting" &&
    (navigation.formAction?.endsWith(targetAction) ?? false);

  const isSaving = isThisCardSubmitting && method === "put";
  const isDeleting = isThisCardSubmitting && method === "delete";
  const isBusy = isSaving || isDeleting;

  // Overlay message for when saving an experience
  const overlayMessage = isDeleting ? "Deleting experience…" : "Saving experience…";

  return (
    <div
      className="relative p-6 bg-white rounded-lg shadow space-y-4"
      aria-busy={isBusy}
    >
      {/* Full-card dimmer overlay */}
      {isBusy && (
        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm pointer-events-none" />
      )}

      {/* Sticky status banner */}
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
        action={`/admin/experiences/${experience._id}`}
        onSubmit={() => onDangerousSubmit?.()}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-700"
          disabled={isBusy || !auth}
        >
          Delete experience
        </button>
      </Form>

      {/* Save form */}
      <Form
        method="put"
        encType="multipart/form-data"
        action={`/admin/experiences/${experience._id}`}
        onSubmit={() => onSubmitStart?.(experience.position)}
        ref={formRef}
      >
        {/* Disable all inputs while busy */}
        <fieldset disabled={isBusy} className={isBusy ? "pointer-events-none" : undefined}>
          {isDirty && (
            <div role="status" className="border-s-4 border-yellow-700 bg-yellow-50 p-4">
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
                You have made changes to this experience. If you do not save the experience, you will lose your changes when you navigate away.
              </p>
            </div>
          )}

          {/* Radio buttons for experience type */}
          <div className="flex gap-4">
            <fieldset className="mb-4">
              <legend className="text-sm font-medium text-gray-700">Experience Type</legend>

              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="typeEx"
                    value="Professional"
                    defaultChecked={experience.typeEx === "Professional"}
                  />
                  <span>Professional</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="typeEx"
                    value="Education"
                    defaultChecked={experience.typeEx === "Education"}
                  />
                  <span>Education</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="typeEx"
                    value="Personal"
                    defaultChecked={experience.typeEx === "Personal"}
                  />
                  <span>Personal</span>
                </label>
              </div>
            </fieldset>
          </div>

          {/* Input for position, company, and dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-2 border border-gray-300 rounded"
              placeholder="Position"
              defaultValue={experience.position}
              name="position"
              required
              maxLength={100}
            />
            <input
              className="p-2 border border-gray-300 rounded"
              placeholder="Company"
              defaultValue={experience.company}
              name="company"
              maxLength={100}
            />
            <input
              className="p-2 border border-gray-300 rounded"
              placeholder="Start Date"
              type="date"
              defaultValue={experience.startDate?.slice(0, 10) ?? ""}
              name="startDate"
              required
            />
            <input
              className="p-2 border border-gray-300 rounded"
              placeholder="End Date"
              type="date"
              defaultValue={experience.endDate?.slice(0, 10) ?? ""}
              name="endDate"
            />
          </div>

          {/* List of highlights */}
          <div className="mt-2">
            <label className="font-semibold">Highlights:</label>
            <List
              name="highlights"
              initialItems={experience.highlights}
              onDirty={(dirty) => childDirty(dirty)}
            />
          </div>

          {/* List of skills */}
          <div className="mt-2">
            <label className="font-semibold">Skills:</label>
            <List
              name="skills"
              initialItems={experience.skills}
              onDirty={(dirty) => childDirty(dirty)}
            />
          </div>

          {/* FileList of images */}
          <div className="mt-2">
            <label className="font-semibold">Images:</label>
            <FileListEditor initialFiles={experience.images} resetKey={resetKey} />
          </div>

          {/* Input for extra info */}
          <div className="mt-2">
            <label className="font-semibold">Extra:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue={experience.extra}
              name="extra"
              maxLength={2000}
            />
          </div>

          {/* Submit button */}
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
