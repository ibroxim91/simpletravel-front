'use client';

import { Input } from '@/shared/ui/input';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

const CitySelect = () => {
  const t = useTranslations();
  const [openCity, setOpenCity] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cities = ['Самарканд', 'Бухара', 'Наваи', 'Бишкек', 'Казан', 'Астана'];

  const filteredCities =
    search.trim() === ''
      ? cities
      : cities.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      className="relative flex gap-2 text-white items-center h-full max-lg:hidden"
      ref={wrapperRef}
    >
      <div
        onClick={() => {
          setOpenCity(!openCity);
          setSearch('');
        }}
        className="flex items-center cursor-pointer gap-2"
      >
        <LocationOnIcon sx={{ color: 'white', width: 28, height: 28 }} />
        <p className="text-md text-white font-medium">{t('Укажите город')}</p>
        <ChevronRightIcon sx={{ color: 'white', width: 24, height: 24 }} />
      </div>

      {openCity && (
        <div
          className="fixed inset-0 bg-black/40 -z-10"
          onClick={() => setOpenCity(false)}
        />
      )}

      {openCity && (
        <ArrowDropUpOutlinedIcon
          sx={{
            position: 'absolute',
            bottom: '-30px',
            zIndex: 60,
            fontSize: '32px',
            color: 'white',
            left: '8px',
          }}
        />
      )}

      {openCity && (
        <div
          className="absolute top-10 mt-1.5 border-white shadow-md font-medium rounded-2xl bg-white w-60 z-50 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative mb-2">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Укажите город"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 text-black"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>

          {filteredCities.length > 0 ? (
            filteredCities.map((cityName) => (
              <div
                key={cityName}
                className="p-2 hover:bg-gray-200 text-black items-center cursor-pointer flex justify-between"
                onClick={() => {
                  setSelectedCity(cityName);
                  setOpenCity(false);
                }}
              >
                {cityName}
                {cityName === selectedCity && (
                  <DoneIcon sx={{ width: '14px', height: '14px' }} />
                )}
              </div>
            ))
          ) : (
            <div className="p-2 text-black">Hech narsa topilmadi</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelect;
