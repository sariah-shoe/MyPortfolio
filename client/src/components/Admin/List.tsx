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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:border-gray-200 disabled:bg-gray-500"
        disabled={items.length == 10 ? true : false}
      >
        Add {name.slice(0, 1).toUpperCase() + name.slice(1)}
      </button>
      {items.length == 10 && <div role="alert" className="border-s-4 border-red-700 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>

          <strong className="font-medium"> You can only have 10 {name} </strong>
        </div>

        <p className="mt-2 text-sm text-red-700">
          If you would like to add more, please delete an item.
        </p>
      </div>}
    </div>
  );
}
