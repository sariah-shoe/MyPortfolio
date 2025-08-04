interface ListProps {
  itemList: string[];
  setItemList: (newValue: string[]) => void;
}

export default function ChangeDirection({ itemList, setItemList }: ListProps) {
  const handleItemChange = (index: number, value: string) => {
    const updated = [...itemList];
    updated[index] = value;
    setItemList(updated);
  };

  const addItem = () => {
    setItemList([...itemList, '']);
  };

  const removeItem = (index: number) => {
    setItemList(itemList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {itemList.map((step, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row md:items-start gap-2 border border-gray-200 p-3 rounded"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step {index + 1}
            </label>
            <textarea
              name={`directions[${index}]`}
              value={step}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[60px] text-sm"
              placeholder="Enter step..."
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
        Add Item
      </button>
    </div>
  );
}
