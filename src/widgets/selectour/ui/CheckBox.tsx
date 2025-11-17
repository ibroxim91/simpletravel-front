import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Dispatch, SetStateAction } from 'react';

type CheckboxFilterProps<T extends string | string[] | null> = {
  label: string;
  value: string;
  selectedValue?: T;
  exclusive?: boolean;
  setChecked?: Dispatch<SetStateAction<T>>;
  onclick?: Dispatch<SetStateAction<number>>;
};

function CheckboxFilter<T extends string | string[] | null>({
  label,
  value,
  selectedValue,
  exclusive,
  onclick,
  setChecked,
}: CheckboxFilterProps<T>) {
  const isChecked = Array.isArray(selectedValue)
    ? selectedValue.includes(value)
    : selectedValue === value;

  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2">
      <Checkbox
        id={label}
        checked={isChecked}
        value={value}
        className="cursor-pointer"
        onCheckedChange={(checked) => {
          if (!setChecked) return;
          if (Array.isArray(selectedValue)) {
            // multiple tanlov uchun
            if (checked) {
              setChecked([...selectedValue, value] as T);
            } else {
              setChecked(selectedValue.filter((v) => v !== value) as T);
            }
          } else if (exclusive) {
            // bitta tanlovli checkbox
            setChecked((checked ? value : null) as T);
          } else {
            setChecked((checked ? value : null) as T);
          }
          if (onclick) {
            onclick(1);
          }
        }}
      />
      <Label className="text-[#373739] text-md cursor-pointer" htmlFor={label}>
        {label}
      </Label>
    </label>
  );
}

export default CheckboxFilter;
