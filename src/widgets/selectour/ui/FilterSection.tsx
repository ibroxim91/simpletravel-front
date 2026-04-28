'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

function FilterSection({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
}) {
  const [hide, setHide] = useState<boolean>(false);

  const toggleHide = () => setHide(!hide);

  return (
    <div>
      <div
        className="flex items-center gap-2  mt-3 cursor-pointer"
        onClick={toggleHide}
      >
        {icon && (
            <img src={icon} alt="icon" className="w-5 h-5" />
          )}
        
        <p className="text-base font-semibold leading-5 text-[#6B7280]">
          
          {title}
          </p>
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
