'use client';

import { country_api } from '@/shared/config/api/country';
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

interface RegionType {
  id: number | string;
  name: string;
}

const CitySelect = () => {
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

  const filteredRegions =
    countries?.flatMap((country) =>
      country.regions.filter((region) =>
        region.name.toLowerCase().includes(search.toLowerCase()),
      ),
    ) ?? [];

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
        <div className="absolute top-10 mt-1.5 shadow-md font-medium rounded-2xl bg-white w-60 z-50 p-2">
          <div className="relative mb-2 flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#909091]" />
              <Input
                placeholder={t('Укажите город')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 text-[#212122] placeholder:text-[#909091]"
              />
            </div>
          </div>

          {filteredRegions.length > 0 ? (
            filteredRegions.map((city) => (
              <div
                key={city.id}
                className="p-2 hover:bg-gray-200 rounded-lg text-[#212122] flex justify-between items-center cursor-pointer"
                onClick={() => handleCitySelect(city)}
              >
                {city.name}
                {selectedCity?.id === city.id && (
                  <DoneIcon sx={{ width: 14, height: 14 }} />
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
