import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Dispatch, SetStateAction } from 'react';

function CheckboxFilter({
  label,
  setChecked,
  value,
  selectedValue,
  exclusive,
}: {
  label: string;
  value: string;
  defaultChecked?: boolean;
  selectedValue?: string | null;
  exclusive?: boolean;
  setChecked?: Dispatch<SetStateAction<string | null>>;
}) {
  const isChecked = exclusive ? selectedValue === value : undefined;
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2">
      <Checkbox
        id={label}
        checked={isChecked}
        value={value}
        className="cursor-pointer"
        onCheckedChange={(checked) => {
          if (!setChecked) return;

          if (exclusive) {
            setChecked(checked ? value : null);
          } else {
            setChecked(checked ? value : null);
          }
        }}
      />
      <Label className="text-gray-700 text-md cursor-pointer" htmlFor={label}>
        {label}
      </Label>
    </label>
  );
}

export default CheckboxFilter;
