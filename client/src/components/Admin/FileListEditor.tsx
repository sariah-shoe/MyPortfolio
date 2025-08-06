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
                        <div className="font-semibold">Image {index + 1}</div>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-red-600 text-sm hover:underline"
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
                        <label className="text-sm">
                            Type:
                            <input
                                type="text"
                                name={`images[${index}].type`}
                                value={file.type}
                                onChange={(e) => handleChange(index, "type", e.target.value)}
                                className="block w-full border rounded p-1 mt-1"
                            />
                        </label>
                        <label className="text-sm">
                            URL:
                            <input
                                type="text"
                                name={`images[${index}].url`}
                                value={file.url}
                                onChange={(e) => handleChange(index, "url", e.target.value)}
                                className="block w-full border rounded p-1 mt-1"
                            />
                        </label>
                        <label className="text-sm">
                            Public ID:
                            <input
                                type="text"
                                name={`images[${index}].public_id`}
                                value={file.public_id}
                                onChange={(e) => handleChange(index, "public_id", e.target.value)}
                                className="block w-full border rounded p-1 mt-1"
                            />
                        </label>
                        <label className="text-sm">
                            Uploaded At:
                            <input
                                type="datetime-local"
                                name={`images[${index}].uploadedAt`}
                                value={new Date(file.uploadedAt).toISOString().slice(0, 16)}
                                onChange={(e) => handleChange(index, "uploadedAt", e.target.value)}
                                className="block w-full border rounded p-1 mt-1"
                            />
                        </label>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Add Image
            </button>
        </div>
    );
}
