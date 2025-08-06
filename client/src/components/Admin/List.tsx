import { useState } from "react";

interface ListProps {
  name: string;
  initialItems: string[];
}

export default function List({ name, initialItems }: ListProps) {
  const [items, setItems] = useState(initialItems.length > 0 ? initialItems : [""]);

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const addItem = () => setItems([...items, ""]);

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 mt-2">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col md:flex-row md:items-start gap-2 border border-gray-200 p-3 rounded">
          <div className="flex-1">
            <textarea
              name={`${name}[${index}]`}
              defaultValue={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[60px] text-sm"
              placeholder={`Enter ${name}...`}
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="self-start mt-1 md:mt-6 px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-500 border border-red-500 rounded transition-colors"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add {name.slice(0, 1).toUpperCase() + name.slice(1)}
      </button>
    </div>
  );
}
