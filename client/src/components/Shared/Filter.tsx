import { useMemo, useState } from "react";

interface FilterProps {
  skills: string[];
  filter: string[];
  setFilter: (newValue: string[]) => void;
}

export default function Filter({ skills, filter, setFilter }: FilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSkill = (skill: string) => {
    if (filter.includes(skill)) {
      setFilter(filter.filter((s) => s !== skill));
    } else {
      setFilter([...filter, skill]);
    }
  };

  const visibleSkills = useMemo(() => {
    const lower = searchTerm.toLowerCase();

    return [...skills]
      .filter((skill) => skill.toLowerCase().includes(lower))
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.localeCompare(b, "en", { sensitivity: "base" })
          : b.localeCompare(a, "en", { sensitivity: "base" })
      );
  }, [skills, searchTerm, sortOrder]);

  const clearAll = () => setFilter([]);

  return (
    <div className="flex gap-4 sm:gap-6">
      <details className="group relative">
        <summary className="flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden">
          <span className="text-sm font-medium"> Skills </span>

          <span className="transition-transform group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </summary>

        <div className="z-auto w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8">
          {/* header: count + reset */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-700">
              {filter.length} Selected
            </span>

            <button
              type="button"
              className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
              onClick={clearAll}
            >
              Reset
            </button>
          </div>

          {/* search + sort row */}
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              type="text"
              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Search skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              title={
                sortOrder === "asc"
                  ? "Sort Z → A"
                  : "Sort A → Z"
              }
            >
              {sortOrder === "asc" ? "A→Z" : "Z→A"}
            </button>
          </div>

          {/* list of skills – scrollable, ~5 items tall */}
          <fieldset className="p-3">
            <legend className="sr-only">Skills</legend>

            <div className="flex flex-col items-start gap-3 max-h-48 overflow-y-auto pr-2">
              {visibleSkills.map((skill) => (
                <label
                  key={skill}
                  htmlFor={skill}
                  className="inline-flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    className="size-5 rounded border-gray-300 shadow-sm"
                    id={skill}
                    onChange={() => toggleSkill(skill)}
                    checked={filter.includes(skill)}
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {skill}
                  </span>
                </label>
              ))}

              {visibleSkills.length === 0 && (
                <p className="text-sm text-gray-500">No skills match your search.</p>
              )}
            </div>
          </fieldset>
        </div>
      </details>
    </div>
  );
}
