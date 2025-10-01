'use client';

import React, { useState } from 'react';

export default function DiscussionItem({
  item,
  index,
}: {
  item: { question: string; answer: string };
  index: number;
}) {
  const [isOpenAnswer, setIsOpenAnswer] = useState<boolean>(false);
  return (
    <div
      key={index}
      className="p-[20px] cursor-pointer rounded-[16px] bg-[#ffffff] mb-[15px]"
    >
      <h1
        onClick={() => setIsOpenAnswer(!isOpenAnswer)}
        className={`font-semibold ${isOpenAnswer ? 'text-[#084FE3]' : ''}`}
      >
        {item.question}
      </h1>
      {isOpenAnswer && <p className="mt-[8px]">{item.answer}</p>}
    </div>
  );
}
