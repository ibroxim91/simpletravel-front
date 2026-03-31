'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [hide, setHide] = useState<boolean>(false);

  const toggleHide = () => setHide(!hide);

  return (
    <div className="mt-5">
      <div
        className="flex justify-between items-center mb-2 cursor-pointer"
        onClick={toggleHide}
      >
        <p className="font-semibold text-[#212122]">{title}</p>
        {hide ? (
          <ChevronDownIcon color="#212122" />
        ) : (
          <ChevronUpIcon color="#212122" />
        )}
      </div>
      {!hide && children}
      <hr className="my-3 border-[#DFDFDF]" />
    </div>
  );
}

export default FilterSection;
