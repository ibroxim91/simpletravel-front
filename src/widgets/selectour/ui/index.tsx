'use client';

import { useEffect, useState } from 'react';
import FilterSection from './FilterSection';
import Slider from 'rc-slider';
import Checkbox from './CheckBox';
import TourItem from './TourItem';
import 'rc-slider/assets/index.css';

export default function Selectour() {
  const [priceRange, setPriceRange] = useState<number[]>([100, 300]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = 100;
      setIsSticky(window.scrollY > triggerPoint);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#edeef1] min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="custom-container">
        <div className="pt-4 flex items-center gap-3 text-[#646465]">
          <p>Главная страница</p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9107 12.7441C11.5853 13.0695 11.5853 13.5971 11.9107 13.9226C12.2362 14.248 12.7638 14.248 13.0893 13.9226L16.4226 10.5893C16.748 10.2638 16.748 9.73618 16.4226 9.41074L13.0893 6.07741C12.7638 5.75197 12.2362 5.75197 11.9107 6.07741C11.5853 6.40284 11.5853 6.93048 11.9107 7.25592L13.8215 9.16666H4.16658C3.70635 9.16666 3.33325 9.53976 3.33325 9.99999C3.33325 10.4602 3.70635 10.8333 4.16658 10.8333H13.8215L11.9107 12.7441Z"
              fill="#646465"
            />
          </svg>
          <p>Подобрать тур</p>
        </div>
      </div>

      {/* Searchbar here */}

      <div className="custom-container mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 w-[360px] p-5 rounded-2xl bg-white h-max">
          <h2 className="text-lg font-semibold">Фильтры</h2>
          <hr className="my-3 border-[#DFDFDF]" />

          <FilterSection title="Стоимость">
            <Slider
              range
              min={100}
              max={10000}
              value={priceRange}
              onChange={(v) => setPriceRange(v as number[])}
            />
            <div className="flex justify-between mt-3 border border-[#DFDFDF] rounded-xl p-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([+e.target.value, priceRange[1]])
                }
                className="w-1/2 border-none outline-none text-gray-600"
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], +e.target.value])
                }
                className="w-1/2 border-none outline-none text-right text-gray-600"
              />
            </div>
          </FilterSection>

          <FilterSection title="Название отеля">
            <input
              type="text"
              placeholder="Название отеля"
              className="w-full border rounded-xl px-3 py-2 outline-none"
            />
          </FilterSection>

          <FilterSection title="Условия въезда">
            <Checkbox label="Без визы" defaultChecked />
            <Checkbox label="С визой" />
          </FilterSection>

          <FilterSection title="Продолжительность тура">
            <Checkbox label="7 ночей / 8 дней" defaultChecked />
            <Checkbox label="10 ночей / 11 дней" />
            <Checkbox label="14 ночей / 15 дней" />
          </FilterSection>

          <FilterSection title="Регионы и курорты">
            <Checkbox label="Все регионы" />
            <Checkbox label="Курорты" />
            <Checkbox label="Марса Алам" />
          </FilterSection>

          <FilterSection title="Категория отеля">
            <Checkbox label="5 звезд" />
            <Checkbox label="4 звезды" />
            <Checkbox label="3 звезды" />
          </FilterSection>

          <FilterSection title="Питание">
            <Checkbox label="Все включено" />
            <Checkbox label="Завтрак" />
            <Checkbox label="Полупансион" />
          </FilterSection>

          <FilterSection title="Пляж">
            <Checkbox label="Пляжный" />
            <Checkbox label="Песчано-галечный пляж" />
            <Checkbox label="Собственный пляж" />
          </FilterSection>

          <FilterSection title="Тип отеля">
            <Checkbox label="Отель" />
            <Checkbox label="Курорт" />
            <Checkbox label="Пансионат" />
          </FilterSection>

          <FilterSection title="Водные развлечения">
            <Checkbox label="Открытый бассейн" />
            <Checkbox label="Открытый бассейн с подогревом" />
            <Checkbox label="Крытый бассейн" />
          </FilterSection>

          <FilterSection title="Для детей">
            <Checkbox label="Детское меню" />
            <Checkbox label="Детская площадка" />
            <Checkbox label="Детский сад" />
          </FilterSection>

          <FilterSection title="Дополнительно">
            <Checkbox label="Wi-Fi" />
            <Checkbox label="Парковка" />
            <Checkbox label="Трансфер" />
          </FilterSection>
        </div>

        {/* Cards place (for tours) */}
        <div className="col-span-3">
          <div className="w-full flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-5">
            <h1 className="font-bold text-[24px] max-md:text-[20px]">
              Туры в Египет: найдено 116 предложений
            </h1>

            <div className="flex items-center justify-between p-[12px] rounded-xl border border-[#DFDFDF] gap-4 bg-[#FFFFFF]">
              <input
                type="text"
                placeholder="По возрастанию цены"
                className="text-[#909091] outline-none border-none"
              />
              <button>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.293 5.33334C12.7123 5.33334 12.9453 5.81831 12.6834 6.14569L8.39041 11.512C8.19025 11.7622 7.80971 11.7622 7.60955 11.512L3.31652 6.14569C3.05462 5.81831 3.28771 5.33334 3.70696 5.33334L12.293 5.33334Z"
                    fill="#212122"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <TourItem key={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
