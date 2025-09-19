'use client';

import { Input } from '@/shared/ui/input';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

const CitySelectMobile = () => {
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
      className="relative flex gap-2 text-white items-center h-full lg:hidden"
      ref={wrapperRef}
    >
      <div
        onClick={() => {
          setOpenCity(!openCity);
          setSearch('');
        }}
        className="flex items-center cursor-pointer gap-2 font-medium"
      >
        <LocationOnIcon sx={{ color: 'white', width: 28, height: 28 }} />
        <p className="text-sm text-white">{t('Укажите город')}</p>
        <ChevronRightIcon sx={{ color: 'white', width: 24, height: 24 }} />
      </div>
      <Drawer
        anchor="bottom"
        open={openCity}
        onClose={() => setOpenCity(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 2,
            width: '100%',
            overflow: 'hidden',
            minHeight: '70%',
          },
        }}
      >
        <div className="flex flex-col gap-4 w-full font-medium">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{t('Выберите город')}</p>
          </div>
          <div className="relative">
            <Input
              placeholder="Укажите город"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 text-black"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
            <SearchIcon
              sx={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: 'gray',
              }}
            />
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh]">
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
        </div>
      </Drawer>
    </div>
  );
};

export default CitySelectMobile;
