'use client';

import { Input } from '@/shared/ui/input';
import { useFilterToursStore } from '@/widgets/filter/lib/store';
import Ticket_Api from '@/widgets/selectour/lib/api';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const CitySelectMobile = () => {
  const [openCity, setOpenCity] = useState(false);
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { where, setStoreWhere } = useFilterToursStore();
  const [citiesWhere, setCitiesWhere] = useState<string[]>([]);
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

  const filteredCities =
    search.trim() === ''
      ? citiesWhere
      : citiesWhere.filter((c) =>
          c.toLowerCase().includes(search.toLowerCase()),
        );

  useEffect(() => {
    if (where) {
      setSelectedCity(where);
    }
  }, [where]);

  useEffect(() => {
    if (search.trim()) {
      const handler = setTimeout(() => {
        setStoreWhere(search);
        router.push('/selectour');
        setOpenCity(false);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [search, setStoreWhere, router]);

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
        <p className="text-sm text-white">
          {selectedCity || t('Укажите город')}
        </p>
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
              placeholder={t('Укажите город')}
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
                    setStoreWhere(cityName);
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
              <div className="p-2 text-black">{t('Не найдено')}</div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CitySelectMobile;
