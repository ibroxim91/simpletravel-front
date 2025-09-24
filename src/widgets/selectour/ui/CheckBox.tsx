function Checkbox({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 !text-[#1764FC] border border-[#1764FC] rounded-[10px] !bg-gray-100 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

export default Checkbox;
