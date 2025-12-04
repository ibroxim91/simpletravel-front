'use client';

import { country_api } from '@/shared/config/api/country';
import { Input } from '@/shared/ui/input';
import { useFilterToursStore } from '@/widgets/filter/lib/store';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface RegionType {
  id: number | string;
  name: string;
}
const CitySelectMobile = () => {
  const t = useTranslations();
  const route = useRouter();
  const searchParams = useSearchParams();
  const departure = searchParams.get('departure');

  const { where, setStoreWhere } = useFilterToursStore();

  const [openCity, setOpenCity] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<RegionType | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: countries } = useQuery({
    queryKey: ['country_list'],
    queryFn: () => country_api.list(),
    select(data) {
      return data.data.data;
    },
  });

  useEffect(() => {
    if (!countries) return;

    if (departure) {
      const foundByQuery = countries
        .flatMap((c) => c.regions)
        .find((region: RegionType) => String(region.id) === String(departure));

      if (foundByQuery) {
        setSelectedCity(foundByQuery);
        setStoreWhere(String(foundByQuery.id));
        return;
      }
    }

    if (where) {
      const foundByStore = countries
        .flatMap((c) => c.regions)
        .find((region: RegionType) => String(region.id) === String(where));

      if (foundByStore) {
        setSelectedCity(foundByStore);
      } else {
        setSelectedCity(null);
      }
    }
  }, [countries, departure, where]);

  useEffect(() => {}, []);

  const handleCitySelect = (city: RegionType | 'all') => {
    const params = new URLSearchParams(searchParams.toString());

    if (city === 'all') {
      setSelectedCity(null);
      setSearch('');
      setStoreWhere('');
      params.delete('departure');
    } else {
      setSelectedCity(city);
      setStoreWhere(String(city.id));
      params.set('departure', String(city.id));
    }

    params.set('page', '1');
    route.push(`/selectour?${params.toString()}`);
    setOpenCity(false);
  };

  const displayCity = selectedCity ? selectedCity.name : t('Укажите город');

  const filteredCities =
    countries?.flatMap((country) =>
      country.regions.filter((region) =>
        region.name.toLowerCase().includes(search.toLowerCase()),
      ),
    ) ?? [];

  return (
    <div
      className="relative flex gap-2 text-white items-center h-full lg:hidden"
      ref={wrapperRef}
    >
      <div
        onClick={() => {
          setOpenCity(true);
          setSearch('');
        }}
        className="flex items-center cursor-pointer gap-2 font-medium"
      >
        <LocationOnIcon sx={{ width: 28, height: 28, color: 'white' }} />
        <p className="text-sm text-white">{displayCity}</p>
        <ChevronRightIcon sx={{ width: 24, height: 24, color: 'white' }} />
      </div>

      {/* Drawer (Bottom Sheet) */}
      <Drawer
        anchor="bottom"
        open={openCity}
        onClose={() => setOpenCity(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
            width: '100%',
            minHeight: '70%',
            overflow: 'hidden',
          },
        }}
      >
        <div className="flex flex-col gap-4 w-full font-medium">
          <p className="text-lg text-[#121212] font-semibold">
            {t('Выберите город')}
          </p>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder={t('Укажите город')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 text-[#121212] placeholder:text-[#909091]"
            />
            <SearchIcon
              sx={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: '#909091',
              }}
            />
          </div>

          <div
            className={clsx(
              'flex overflow-y-auto max-h-[60vh]',
              filteredCities.length > 0
                ? 'flex-col gap-2'
                : 'justify-center items-center',
            )}
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="p-2 hover:bg-gray-200 text-[#121212] cursor-pointer flex justify-between"
                  onClick={() => handleCitySelect(city)}
                >
                  {city.name}
                  {selectedCity === city && (
                    <DoneIcon sx={{ width: 14, height: 14 }} />
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#121212] m-auto">{t('Не найдено')}</p>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CitySelectMobile;
