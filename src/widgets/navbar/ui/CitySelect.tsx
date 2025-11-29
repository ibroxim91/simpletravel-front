'use client';

import { useRouter } from '@/shared/config/i18n/navigation';
import { Input } from '@/shared/ui/input';
import { useFilterToursStore } from '@/widgets/filter/lib/store';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { location_api } from '../lib/api';

const CitySelect = () => {
  const t = useTranslations();
  const route = useRouter();
  const searchParams = useSearchParams();
  const { where, setStoreWhere } = useFilterToursStore();

  const [openCity, setOpenCity] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [citiesWhere, setCitiesWhere] = useState<string[]>([]);

  // Fetch tickets
  const { data: ticket } = useQuery({
    queryKey: ['location_list'],
    queryFn: () => location_api.location_list(),
    select(data) {
      return data.data.data;
    },
  });

  // Set unique cities from tickets
  useEffect(() => {
    if (ticket) {
      const uniqueCities = Array.from(
        new Set(ticket.departures.slice(0, 8).map((e) => e)),
      );
      setCitiesWhere(uniqueCities);
    }
  }, [ticket]);

  // Handle URL params and store
  useEffect(() => {
    const destinationParam = searchParams.get('departure') || '';

    // Ustunlik beramiz store qiymatiga
    const cityToDisplay = where || destinationParam;

    setSelectedCity(cityToDisplay);
    setSearch(cityToDisplay);
  }, [searchParams, where]);

  // Filter cities for search
  const filteredCities = citiesWhere.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  // Handle selecting a city
  const handleCitySelect = (cityName: string) => {
    if (cityName === 'all') {
      setSelectedCity('');
      setSearch('');
      setStoreWhere('');

      // URL dan destination ni o'chirish
      const params = new URLSearchParams(searchParams.toString());
      params.delete('departure');
      params.set('page', '1');

      route.push(`/selectour?${params.toString()}`);
    } else {
      setSelectedCity(cityName);
      setSearch(cityName);
      setStoreWhere(cityName);

      const params = new URLSearchParams(searchParams.toString());
      params.set('departure', cityName);
      params.set('page', '1');

      route.push(`/selectour?${params.toString()}`);
    }

    setOpenCity(false);
  };

  // Display city name or placeholder
  const displayCity =
    !selectedCity || selectedCity === 'all' ? t('Укажите город') : selectedCity;

  return (
    <div
      className="relative flex gap-2 text-white items-center h-full max-lg:hidden"
      ref={wrapperRef}
    >
      <div
        onClick={() => setOpenCity(!openCity)}
        className="flex items-center cursor-pointer gap-2"
      >
        <LocationOnIcon sx={{ color: 'white', width: 28, height: 28 }} />
        <p className="text-md text-white font-medium truncate max-w-[180px]">
          {displayCity}
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
          <div className="relative mb-2 flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#909091]" />
              <Input
                placeholder={t('Укажите город')}
                className="w-full pl-10 text-[#212122] placeholder:text-[#909091]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* "Barchasi" */}
          <div
            key="all"
            className="p-2 hover:bg-gray-200 rounded-lg text-[#212122] flex justify-between items-center cursor-pointer"
            onClick={() => handleCitySelect('all')}
          >
            {'Barchasi'}
            {selectedCity === '' && (
              <DoneIcon sx={{ width: '14px', height: '14px' }} />
            )}
          </div>

          {/* Cities list */}
          {filteredCities.length > 0 ? (
            filteredCities.map((cityName) => (
              <div
                key={cityName}
                className="p-2 hover:bg-gray-200 rounded-lg text-[#212122] flex justify-between items-center cursor-pointer"
                onClick={() => handleCitySelect(cityName)}
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
