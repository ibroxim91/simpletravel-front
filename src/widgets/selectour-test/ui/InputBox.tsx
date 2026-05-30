import { icons } from '../lib/data';

function InputBox({
  placeholder,
  icon,
  showLabel,
  label,
}: {
  label?: string;
  placeholder: string;
  icon?: string;
  showLabel: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {showLabel && <p className="text-sm text-gray-700">{label}</p>}
      <div className="flex items-center border rounded-xl px-3 py-2">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full border-none outline-none"
        />
        {icon && <div>{icons[icon as keyof typeof icons].icon}</div>}
      </div>
    </div>
  );
}

export default InputBox;
