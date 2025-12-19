import { useEffect, useMemo, useState } from "react";
import type { Item } from "../Shared/types";

// Props needed for a list
interface ListProps {
  name: string;
  initialItems: string[];
  onDirty?: (isDirty: boolean) => void;
}

// Editable list of items
export default function List({ name, initialItems, onDirty }: ListProps) {
  // A way to turn values into a list item with an id
  const makeItem = (value = "") => ({
    id: crypto.randomUUID(),
    value,
  });

  // Make sure that every initial item has a key
  const [items, setItems] = useState<Item[]>(
    initialItems.length > 0
      ? initialItems.map(v => makeItem(v))
      : [makeItem()]
  );


  // Local dirty flag; only flips true on edit, resets when initialItems change
  const [isDirty, setIsDirty] = useState(false);

  // Normalize my list
  const norm = (arr: string[]) =>
    arr.map((s) => (s ?? "").trim()).filter(s => s !== "");

  // Precompute normalized baselines so comparisons are cheap & stable
  const baseline = useMemo(() => norm(initialItems), [initialItems]);

  // Handle item changes
  const handleItemChange = (index: number, value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = makeItem(value);
      return updated;
    });
  };

  // Add item
  const addItem = () => setItems((prev) => [...prev, makeItem("")]);

  // Remove item
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  // Flip dirty to true on any divergence from baseline
  useEffect(() => {
    if (isDirty) return; // already dirty; don't evaluate further

    // Compare to baseline
    const current = norm(items.map(item => item.value));
    const arraysEqual =
      current.length === baseline.length &&
      current.every((v, i) => v === baseline[i]);

    if (!arraysEqual) {
      setIsDirty(true);
      onDirty?.(true); // notify parent once
    }
  }, [items, baseline, isDirty, onDirty]);

  // Reset when canonical data reloads (after save), sync & clear dirty
  useEffect(() => {
    // sync UI to latest server data
    setItems(initialItems.length > 0 ? initialItems.map(v => makeItem(v)) : [makeItem()]);

    if (isDirty) {
      setIsDirty(false);
      onDirty?.(false);
    }
  }, [initialItems]);

  // List component
  return (
    <div className="space-y-4 mt-2">
      {/* Map all my items */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row md:items-start gap-2 border border-gray-200 p-3 rounded"
        >
          <div className="flex-1">
            {/* Item text */}
            <label className="sr-only" htmlFor={`item-${index}`}>
              {name} item {index + 1}
            </label>
            <textarea
              name={`${name}[]`}
              id={`item-${index}`}
              defaultValue={item.value}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[60px] text-sm"
              placeholder={`Enter ${name}...`}
            />
          </div>
          {/* Delete item */}
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="self-start mt-1 md:mt-6 px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-500 border border-red-500 rounded transition-colors"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Button to add items to list */}
      <button
        type="button"
        onClick={addItem}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:border-gray-200 disabled:bg-gray-500"
        disabled={items.length >= 10}
      >
        Add {name.slice(0, 1).toUpperCase() + name.slice(1)}
      </button>

      {/* Limit number of list items to 10 */}
      {items.length >= 10 && (
        <div role="alert" className="border-s-4 border-red-700 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <strong className="font-medium"> You can only have 10 {name} </strong>
          </div>
          <p className="mt-2 text-sm text-red-700">
            If you would like to add more, please delete an item.
          </p>
        </div>
      )}
    </div>
  );
}
