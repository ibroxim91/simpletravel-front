'use client';

import { useRouter } from '@/shared/config/i18n/navigation';
import { Input } from '@/shared/ui/input';
import { useFilterToursStore } from '@/widgets/filter/lib/store';
import Ticket_Api from '@/widgets/selectour/lib/api';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const CitySelect = () => {
  const [openCity, setOpenCity] = useState(false);
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [citiesWhere, setCitiesWhere] = useState<string[]>([]);
  const { where, setStoreWhere } = useFilterToursStore();
  const router = useRouter();

  const { data: ticket } = useQuery({
    queryKey: ['ticket_all'],
    queryFn: () =>
      Ticket_Api.GetAllTickets({
        params: {
          page: 1,
          page_size: 8,
        },
      }),
  });

  useEffect(() => {
    if (ticket) {
      const uniqueCities = Array.from(
        new Set(
          ticket.data.results.tickets.slice(0, 8).map((e) => e.destination),
        ),
      );
      setCitiesWhere(uniqueCities);
    }
  }, [ticket]);

  useEffect(() => {
    if (where) {
      setSelectedCity(where);
      setSearch(where);
    }
  }, [where]);

  const filteredCities = citiesWhere.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (openCity && search.trim()) {
      const handler = setTimeout(() => {
        setStoreWhere(search);
        router.push('/selectour');
        setOpenCity(false);
      }, 1000);

      return () => clearTimeout(handler);
    } else {
      setStoreWhere('');
      setSelectedCity('');
    }
  }, [search, setStoreWhere, router, openCity]);

  return (
    <div
      className="relative flex gap-2 text-white items-center h-full max-lg:hidden"
      ref={wrapperRef}
    >
      <div
        onClick={() => {
          setOpenCity(!openCity);
          setSearch(where || ''); // ochilganda oxirgi tanlangan qiymat chiqadi
        }}
        className="flex items-center cursor-pointer gap-2"
      >
        <LocationOnIcon sx={{ color: 'white', width: 28, height: 28 }} />
        <p className="text-md text-white font-medium">
          {where || selectedCity || t('Укажите город')}
        </p>
        <ChevronRightIcon sx={{ color: 'white', width: 24, height: 24 }} />
      </div>

      {openCity && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpenCity(false)}
        />
      )}

      {openCity && (
        <ArrowDropUpOutlinedIcon
          sx={{
            position: 'absolute',
            bottom: '-30px',
            fontSize: '32px',
            color: 'white',
            left: '8px',
          }}
        />
      )}

      {openCity && (
        <div
          className="absolute top-10 mt-1.5 shadow-md font-medium rounded-2xl bg-white w-60 z-50 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative mb-2">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#909091]" />
            <Input
              placeholder="Укажите город"
              className="w-full pl-10 text-[#212122] placeholder:text-[#909091]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredCities.length > 0 ? (
            filteredCities.map((cityName) => (
              <div
                key={cityName}
                className="p-2 hover:bg-gray-200 rounded-lg text-[#212122] items-center cursor-pointer flex justify-between"
                onClick={() => {
                  setSelectedCity(cityName);
                  setStoreWhere(cityName);
                  setSearch(cityName);
                  router.push('/selectour');
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
            <div className="p-2 text-[#212122]">{t('Не найдено')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelect;
