'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

function FilterSection({
  title,
  children,
  defaultHidden = false,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultHidden?: boolean;
  icon?: React.ReactNode;
}) {
  const [hide, setHide] = useState<boolean>(defaultHidden);

  const toggleHide = () => setHide(!hide);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleHide}
      >
        <div className="flex items-center gap-4">
          {icon}
          <p className="text-base font-semibold leading-5 text-[#6B7280]">{title}</p>
        </div>
        {hide ? (
          <ChevronDownIcon size={16} color="#6B7280" />
        ) : (
          <ChevronUpIcon size={16} color="#6B7280" />
        )}
      </div>
      {!hide && <div className="mt-6">{children}</div>}
    </div>
  );
}

export default FilterSection;
