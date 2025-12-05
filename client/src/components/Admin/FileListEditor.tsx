import { useRef, useState, useEffect } from "react";
import type { FileObject as BaseFileObject } from "../Shared/types";

type FileObject = BaseFileObject & { _id?: string };

interface FileListEditorProps {
  initialFiles: FileObject[];
  max?: number;
  resetKey?: number;
}

// Editable list of files
export default function FileListEditor({
  initialFiles,
  max = 10,
  resetKey = 0,
}: FileListEditorProps) {
  // Existing files (from the server)
  const [files, setFiles] = useState<FileObject[]>(initialFiles);

  // Which existing files are marked for deletion
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());

  // Newly selected files (live in the <input>, but we also keep them in state)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialFilesKey = JSON.stringify(initialFiles);

  // Reset after successful save or when new initial files arrive
  useEffect(() => {
    // Clear the actual <input type="file">
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      // also clear any internal FileList
      const dt = new DataTransfer();
      fileInputRef.current.files = dt.files;
    }

    // Revoke all preview URLs and clear local state
    newPreviews.forEach(URL.revokeObjectURL);
    setNewPreviews([]);
    setNewFiles([]);

    // Unmark deletions and re-seed existing files
    setPendingDeletes(new Set());
    setFiles(initialFiles);
  }, [resetKey, initialFilesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      newPreviews.forEach(URL.revokeObjectURL);
    };
  }, [newPreviews]);

  // Delete photos
  const toggleDelete = (id?: string) => {
    if (!id) return; // only existing files have ids
    // Existing files are added to pending deletes
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Calculate number of files
  const existingCount = files.filter((f) => !pendingDeletes.has(String(f._id))).length;
  const totalAfterAdd = existingCount + newFiles.length;
  const atCap = totalAfterAdd >= max;

  // Handling change to new files (not saved in server yet)
  const onNewFilesChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = Array.from(e.currentTarget.files ?? []);
    if (!selected.length) return;

    // Respect remaining capacity
    const remaining = Math.max(0, max - existingCount - newFiles.length);
    const toAdd = remaining ? selected.slice(0, remaining) : [];
    if (!toAdd.length) return;

    // Append to state + rebuild the input's FileList so multiple picks accumulate
    setNewFiles((prev) => {
      const next = [...prev, ...toAdd];

      const dt = new DataTransfer();
      next.forEach((f) => dt.items.add(f));
      if (fileInputRef.current) fileInputRef.current.files = dt.files;

      return next;
    });

    setNewPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  // Handling deleting new files (not saved in server yet)
  const removeNewFile = (index: number) => {
    // Remove from newFiles and rebuild the input's FileList
    setNewFiles((prev) => {
      const next = prev.slice(0, index).concat(prev.slice(index + 1));
      const dt = new DataTransfer();
      next.forEach((f) => dt.items.add(f));
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
      return next;
    });

    // Cleanup preview URL
    setNewPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      {/* Hidden input that carries deletions to the server */}
      <input
        type="hidden"
        name="deleteFileIds"
        value={JSON.stringify([...pendingDeletes])}
        readOnly
      />

      {/* Existing images */}
      {files.map((file, index) => {
        const id = file._id ? String(file._id) : undefined;
        const marked = id ? pendingDeletes.has(id) : false;

        return (
          <div
            key={id ?? `existing-${index}`}
            className={`flex flex-col gap-4 border p-4 rounded shadow-sm ${marked ? "opacity-60 ring-2 ring-red-500" : "bg-white"
              }`}
          >
            <div className="flex justify-between items-center">
              {id ? (
                <button
                  type="button"
                  onClick={() => toggleDelete(id)}
                  className={`px-3 py-1.5 rounded text-white ${marked ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {marked ? "Undo Delete" : "Mark for Delete"}
                </button>
              ) : (
                <span className="text-xs text-gray-500">Unsaved</span>
              )}
            </div>

            {file.url && (
              <div className="flex justify-center items-center bg-gray-50 rounded overflow-hidden max-h-[300px]">
                <img
                  src={file.url}
                  alt={`Existing ${index}`}
                  className="h-auto max-h-[300px] w-auto max-w-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold">Type:</p>
                <p>{file.type}</p>
              </div>
              <div>
                <p className="font-semibold">URL:</p>
                <p className="break-all">{file.url}</p>
              </div>
              <div>
                <p className="font-semibold">Public ID:</p>
                <p className="break-all">{file.public_id}</p>
              </div>
              <div>
                <p className="font-semibold">Uploaded At:</p>
                <p>{file.uploadedAt}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* New uploads previews (removable before submit) */}
      {newPreviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newPreviews.map((url, i) => (
            <div key={url} className="border rounded p-3 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">New image {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="flex justify-center items-center bg-gray-50 rounded overflow-hidden max-h-[250px]">
                <img
                  src={url}
                  alt={`New ${i + 1}`}
                  className="h-auto max-h-[250px] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New uploads picker */}
      <label
        htmlFor="newImages"
        className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium">Upload New Images</span>
          <span className="text-sm text-gray-500">
            {totalAfterAdd}/{max}
          </span>
        </div>

        <input
          ref={fileInputRef}
          key={`newImages-${resetKey}`} // helps ensure a full reset after save
          multiple
          accept="image/*"
          type="file"
          id="newImages"
          name="newImages"
          className="sr-only"
          onChange={onNewFilesChange}
          disabled={atCap}
        />

        {/* Show user how many more images they can add and if they are at cap */}
        {!atCap ? (
          <p className="mt-2 text-sm text-gray-600">
            Click to choose up to {Math.max(0, max - existingCount - newFiles.length)} more.
          </p>
        ) : (
          <div
            role="alert"
            className="mt-2 border-s-4 border-red-700 bg-red-50 p-3 text-sm text-red-700"
          >
            <strong className="font-medium">You can only have {max} images.</strong> Delete
            one before adding more.
          </div>
        )}
      </label>
    </div>
  );
}
