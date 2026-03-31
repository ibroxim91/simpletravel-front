'use client';

import React from 'react';
import { questions_answers } from '../lib/data';
import DiscussionItem from './discussionItem';

export default function Discussion() {
  const [activeCategory, setActiveCategory] =
    React.useState<string>('О сервисе');
  return (
    <div className="custom-container">
      <div className="flex items-center gap-5 py-5">
        <h1 className="text-[#646465] text-sm">Главная страница</h1>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9107 12.7441C11.5853 13.0695 11.5853 13.5972 11.9107 13.9226C12.2362 14.248 12.7638 14.248 13.0893 13.9226L16.4226 10.5893C16.748 10.2638 16.748 9.73619 16.4226 9.41075L13.0893 6.07742C12.7638 5.75198 12.2362 5.75198 11.9107 6.07742C11.5853 6.40286 11.5853 6.9305 11.9107 7.25593L13.8215 9.16668H4.16658C3.70635 9.16668 3.33325 9.53977 3.33325 10C3.33325 10.4602 3.70635 10.8333 4.16658 10.8333H13.8215L11.9107 12.7441Z"
            fill="#646465"
          />
        </svg>
        <h1 className="text-[#646465] text-sm">Ответы на вопросы</h1>
      </div>

      <h1 className="font-bold text-[#031753] text-[32px] my-5">
        Ответы на вопросы
      </h1>

      <div className="grid grid-cols-[20%_80%] gap-6">
        <ul className="p-[20px] bg-[#ffffff] rounded-[16px] h-max">
          {Object.keys(questions_answers).map((item, index) => (
            <li
              key={index}
              onClick={() => setActiveCategory(item)}
              className={`cursor-pointer hover:text-[#031753]  py-[10px] px-[20px] ${activeCategory === item ? 'bg-[#EDEEF1] rounded-[10px]' : ''}`}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="w-full">
          {questions_answers[
            activeCategory as keyof typeof questions_answers
          ].map((item, index) => (
            <DiscussionItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
