import { useState } from "react";
import type { FileObject } from "../Shared/types";

interface FileListEditorProps {
    initialFiles: FileObject[];
}

export default function FileListEditor({ initialFiles }: FileListEditorProps) {
    const [files, setFiles] = useState<FileObject[]>(initialFiles);

    const handleRemove = (index: number) => {
        const updated = [...files];
        updated.splice(index, 1);
        setFiles(updated);
    };

    const handleAdd = () => {
        setFiles([
            ...files,
            {
                type: "image",
                url: "",
                public_id: "",
                uploadedAt: new Date().toISOString(),
            },
        ]);
    };

    const handleChange = (index: number, field: keyof FileObject, value: string) => {
        const updated = [...files];
        updated[index] = {
            ...updated[index],
            [field]: field === "uploadedAt" ? new Date(value).toISOString() : value,
        };
        setFiles(updated);
    };

    return (
        <div className="space-y-4">
            {files.map((file, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-4 border p-4 rounded shadow-sm bg-white"
                >
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Remove
                        </button>
                    </div>
                    {file.url && (
                        <div className="flex justify-center items-center bg-gray-50 rounded overflow-hidden max-h-[300px]">
                            <img
                                src={file.url}
                                alt={`Preview ${index}`}
                                className="h-auto max-h-[300px] w-auto max-w-full object-contain"
                            />
                        </div>

                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="text-sm">
                            <p className="font-semibold">Type:</p>
                            <p>{file.type}</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">URL:</p>
                            <p>{file.url}</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">Public ID:</p>
                            <p>{file.public_id}</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">Uploaded At:</p>
                            <p>{file.uploadedAt}</p>
                        </div>
                    </div>
                </div>
            ))}
            <label htmlFor="File" className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                <div className="flex items-center justify-center gap-4">
                    <span className="font-medium"> Upload New Image </span>

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

                <input multiple type="file" id="File" className="sr-only" disabled={files.length == 10 ? true : false} />
                {files.length == 10 && <div role="alert" className="border-s-4 border-red-700 bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path
                                fillRule="evenodd"
                                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>

                        <strong className="font-medium"> You can only have 10 images. </strong>
                    </div>

                    <p className="mt-2 text-sm text-red-700">
                        If you would like to add more, please delete an item.
                    </p>
                </div>}
            </label>
        </div>
    );
}
