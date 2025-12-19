interface ProffToggleProps {
  id: string;
  value: boolean,
  onChange: (newValue: boolean) => void
}

export default function ProffToggle({ id, value, onChange }: ProffToggleProps) {
  return (
    <label
      htmlFor={id}
      className="relative block h-8 w-12 [-webkit-tap-highlight-color:_transparent]"
    >
      <span className="sr-only">Personal mode</span>
      
      <input
        type="checkbox"
        id={id}
        className="peer sr-only"
        checked={value}
        onChange={() => onChange(!value)}
      />
      <span className="absolute inset-0 m-auto h-2 rounded-full bg-gray-300"></span>
      <span className="absolute inset-y-0 start-0 m-auto size-6 rounded-full bg-gray-500 transition-[inset-inline-start] peer-checked:start-6 peer-checked:*:scale-0">
        <span className="absolute inset-0 m-auto size-4 rounded-full bg-gray-200 transition-transform"></span>
      </span>
    </label>
  );
}
