'use client';

import Kuba from '@/assets/Kuba.jpg';
import OAE from '@/assets/OAE.jpg';
import ShriLanka from '@/assets/ShriLanka.jpg';
import Tailand from '@/assets/Tailand.jpg';
import Turk from '@/assets/Turk.jpg';
import { Link } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button';
import FilterTours from '@/widgets/filter/ui/FilterTours';
import FilterToursMobile from '@/widgets/filter/ui/FilterToursMobile';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import FilterListIcon from '@mui/icons-material/FilterList';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Drawer from '@mui/material/Drawer';
import { motion } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from 'react';
import Checkbox from './CheckBox';
import FilterSection from './FilterSection';
import TourItem from './TourItem';

export default function Selectour() {
  const [priceRange, setPriceRange] = useState<number[]>([100, 300]);
  const [openFilter, setFilter] = useState(false);
  const tourItem = [
    {
      img: Kuba,
      id: 1,
      rating: 3,
      like: true,
    },
    {
      img: OAE,
      id: 2,
      rating: 2,
      like: false,
    },
    {
      img: ShriLanka,
      id: 3,
      rating: 4,
      like: false,
    },
    {
      id: 4,
      img: Tailand,
      rating: 5,
      like: true,
    },
    {
      img: Turk,
      id: 5,
      rating: 1,
      like: false,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="custom-container mt-5 bg-[#edeef1] min-h-screen pb-20">
      {/* Breadcrumb */}
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 2,
          },
        }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          Главная страница
        </Link>
        <p className="text-[#646465] font-medium">Подобрать тур</p>
      </Breadcrumbs>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: 'easeOut',
        }}
      >
        <FilterTours />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: 'easeOut',
        }}
      >
        <FilterToursMobile />
      </motion.div>

      {/* Searchbar here */}

      <div className="mt-10 flex gap-10 max-lg:flex-col">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="w-[50%] p-5 rounded-2xl bg-white h-max max-lg:hidden"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="lg:hidden"
        >
          <div
            className="bg-white shadow-sm flex items-center justify-between px-4 py-4 rounded-xl"
            onClick={() => setFilter(true)}
          >
            <p className="font-semibold text-lg">Филтры</p>
            <FilterListIcon />
          </div>
          <Drawer
            anchor="bottom"
            open={openFilter}
            onClose={() => setFilter(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 2,
                width: '100%',
                overflow: 'auto',
                maxHeight: '70%',
              },
            }}
          >
            <div className="mb-5 flex items-center justify-between sticky">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <Button
                variant={'outline'}
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                onClick={() => setFilter(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>

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
            <div className="sticky bottom-0 w-full left-0">
              <button
                className="bg-blue-600 rounded-3xl p-3 w-full text-white cursor-pointer font-semibold"
                onClick={() => {
                  setFilter(false);
                }}
              >
                Применять
              </button>
            </div>
          </Drawer>
        </motion.div>

        {/* Cards place (for tours) */}
        <div className="w-[100%]">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: 'easeOut',
            }}
          >
            <div className="w-full flex justify-between items-center max-lg:flex-col max-lg:items-start max-lg:gap-5">
              <h1 className="font-bold text-2xl text-start">
                Туры в Египет: найдено 116 предложений
              </h1>

              <div className="flex items-center justify-between p-[12px] max-lg:w-full rounded-xl border border-[#DFDFDF] gap-4 bg-[#FFFFFF]">
                <input
                  type="text"
                  placeholder="По возрастанию цены"
                  className="text-[#909091] outline-none border-none w-full"
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
          </motion.div>

          <div className="mt-5">
            {tourItem.map((item) => (
              <TourItem key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
