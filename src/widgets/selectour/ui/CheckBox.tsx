import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';

type CheckboxFilterProps<T extends string | string[] | null> = {
  label: string;
  value: string;
  selectedValue?: T;
  exclusive?: boolean;
  setChecked?: Dispatch<SetStateAction<T>>;
  onclick?: Dispatch<SetStateAction<number>>;
  paramName?: string; // URL param nomi (optional)
};

function CheckboxFilter<T extends string | string[] | null>({
  label,
  value,
  selectedValue,
  exclusive,
  onclick,
  setChecked,
  paramName,
}: CheckboxFilterProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isChecked = Array.isArray(selectedValue)
    ? selectedValue.includes(value)
    : selectedValue === value;

  // URL'dan qiymatni o'qib, state'ni yangilash
  useEffect(() => {
    if (!paramName || !setChecked) return;

    const currentParam = searchParams.get(paramName);

    if (Array.isArray(selectedValue)) {
      const urlValues = currentParam ? currentParam.split(',') : [];
      if (JSON.stringify(urlValues) !== JSON.stringify(selectedValue)) {
        setChecked(urlValues as T);
      }
    } else {
      if (currentParam !== selectedValue) {
        setChecked(currentParam as T);
      }
    }
  }, []);

  const handleChange = (checked: boolean) => {
    if (!setChecked) return;

    let newValue: T;

    if (Array.isArray(selectedValue)) {
      // Ko'p tanlov uchun
      if (checked) {
        newValue = [...selectedValue, value] as T;
      } else {
        newValue = selectedValue.filter((v) => v !== value) as T;
      }
    } else if (exclusive) {
      // Bitta tanlov uchun
      newValue = (checked ? value : null) as T;
    } else {
      newValue = (checked ? value : null) as T;
    }

    setChecked(newValue);

    // URL'ni yangilash (agar paramName berilgan bo'lsa)
    if (paramName) {
      const params = new URLSearchParams(searchParams.toString());

      if (Array.isArray(newValue)) {
        if (newValue.length > 0) {
          params.set(paramName, newValue.join(','));
        } else {
          params.delete(paramName);
        }
      } else {
        if (newValue) {
          params.set(paramName, newValue);
        } else {
          params.delete(paramName);
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    }

    if (onclick) {
      onclick(1);
    }
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2">
      <Checkbox
        id={label}
        checked={isChecked}
        value={value}
        className="cursor-pointer"
        onCheckedChange={handleChange}
      />
      <Label className="text-[#373739] text-md cursor-pointer" htmlFor={label}>
        {label}
      </Label>
    </label>
  );
}

export default CheckboxFilter;
