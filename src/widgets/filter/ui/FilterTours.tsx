import { country_api, CountryListData } from '@/shared/config/api/country';
import { useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { MarqueeText } from '@/shared/ui/MarqueeTex';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import AddIcon from '@mui/icons-material/Add';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RemoveIcon from '@mui/icons-material/Remove';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MoveLeft, MoveRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const FilterTours = ({ selectedDestRegions, setSelectedDestRegions }) => {
  const t = useTranslations();
  const route = useRouter();
  const searchParams = useSearchParams();
  const [ageOpen, setAgeOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectData, setSelectData] = useState<string>('');
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const selectAge = adults + children;
  const [range, setRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchCountry, setSearchCountry] = useState('');
  const [searchRegion, setSearchRegion] = useState('');
  const [openCountry, setOpenCountry] = useState(false);
  const [openDest, setOpenDest] = useState(false);
  const [selectedDestCountry, setSelectedDestCountry] = useState<string>('');
  const [selectedDestRegion, setSelectedDestRegion] = useState<string>('');
  const [searchDestCountry, setSearchDestCountry] = useState('');
  const [searchDestRegion, setSearchDestRegion] = useState('');

  const { data: countries, isLoading } = useQuery({
    queryKey: ['country_list'],
    queryFn: () => country_api.list(),
    select(data) {
      return data.data.data;
    },
  });

  const filteredCountries = countries?.filter((c) =>
    c.name.toLowerCase().includes(searchCountry.toLowerCase()),
  );

  const filteredRegions = countries
    ?.find((c) => c.name === selectedCountry)
    ?.regions.filter((r) =>
      r.name.toLowerCase().includes(searchRegion.toLowerCase()),
    );

  const filteredDestCountries = countries?.filter((c) =>
    c.name.toLowerCase().includes(searchDestCountry.toLowerCase()),
  );

  const filteredDestRegions = countries
    ?.find((c) => c.name === selectedDestCountry)
    ?.regions.filter((r) =>
      r.name.toLowerCase().includes(searchDestRegion.toLowerCase()),
    );

  useEffect(() => {
    const departureId = searchParams.get('departure');
    const destination = searchParams.get('destination');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');
        const filters = {
      departure: departureId,
      destination,
      dateFrom,
      dateTo,
      adults: adultsParam,
      children: childrenParam,
    };
    localStorage.setItem('filterTours', JSON.stringify(filters));

		
    if (departureId) {
      const regionId = Number(departureId);
      let foundCountry: CountryListData | undefined;
      let foundRegion: { id: number; name: string } | undefined;

      countries?.forEach((c) => {
        const r = c.regions.find((reg) => reg.id === regionId);
        if (r) {
          foundCountry = c;
          foundRegion = r;
        }
      });

      if (foundCountry && foundRegion) {
        setSelectedCountry(foundCountry.name);
        setSelectedRegion(String(foundRegion.id));
      }
    }

    if (destination) {
      const regionId = Number(destination);

      let foundCountry: CountryListData | undefined;
      let foundRegion: { id: number; name: string } | undefined;

      countries?.forEach((c) => {
        const reg = c.regions.find((r) => r.id === regionId);
        if (reg) {
          foundCountry = c;
          foundRegion = reg;
        }
      });
     
      if (foundCountry && foundRegion) {
        setSelectedDestCountry(foundCountry.name);
        setSelectedDestRegion(String(foundRegion.id));
        setSelectedDestRegions(String(foundRegion.id));
        
      }
    }

    const from = dateFrom ? new Date(dateFrom) : undefined;
    const to = dateTo ? new Date(dateTo) : undefined;
    setFromDate(from);
    setToDate(to);

    if (from && to) {
      setRange({ from, to });
      setSelectData(
        `${formatDate.format(from, 'DD/MM/YYYY')} - ${formatDate.format(to, 'DD/MM/YYYY')}`,
      );
    }

    setAdults(adultsParam ? parseInt(adultsParam) : 0);
    setChildren(childrenParam ? parseInt(childrenParam) : 0);

    if (!selectedCountry && countries?.length) {
      const defaultCountry = countries.find((c) => c.default_country === true);
      if (defaultCountry) {
        setSelectedCountry(defaultCountry.name);
  
        const defaultRegion = defaultCountry.regions?.find(
          (r) => r.default_region === true
        );
        if (defaultRegion) {
          setSelectedRegion(String(defaultRegion.id));
        }
      }
    }
  }, [searchParams, countries,  selectedCountry, setSelectedCountry, setSelectedRegion]);

  const saveFilter = () => {
    const params = new URLSearchParams();

    if (selectedCountry) {
      if (selectedRegion) {
        params.set('departure', selectedRegion);
      } else {
        params.set('departure', selectedCountry);
      }
    }

    if (selectedDestCountry) {
      if (selectedDestRegion) {
        params.set('destination', selectedDestRegion);
      } else {
        params.set('destination', selectedDestCountry);
      }
    }
    const currentParams = new URLSearchParams(window.location.search);
  const townParam = currentParams.get('town');

  if (townParam) {
    params.set('town', townParam);
  }

    if (fromDate)
      params.set('dateFrom', formatDate.format(fromDate, 'YYYY-MM-DD'));
    if (toDate) params.set('dateTo', formatDate.format(toDate, 'YYYY-MM-DD'));
    if (adults > 0) params.set('adults', adults.toString());
    if (children > 0) params.set('children', children.toString());

    route.push(`/selectour?page=1&${params.toString()}`);
  };

  const items = selectedCountry ? filteredRegions : filteredCountries;
  const itemsDes = selectedDestCountry
    ? filteredDestRegions
    : filteredDestCountries;


    // items ni tayyorlash
const defaultitems = selectedCountry
? countries
    ?.find((c) => c.name === selectedCountry)
    ?.regions || []
: (() => {
    // Agar default bor bo‘lsa faqat o‘sha chiqadi
    const defaultCountry = countries?.find((c) => c.default_country === true);
    return defaultCountry ? [defaultCountry] : countries || [];
  })();


  return (
    <div className="mt-10 bg-white shadow-sm py-4 gap-4 w-full rounded-3xl grid grid-cols-5 items-center px-10 max-lg:hidden font-medium">
      <div className="flex flex-col relative gap-2 h-full">
        <Label className="text-md">{t('Откуда')}</Label>
        <Popover open={openCountry} onOpenChange={setOpenCountry}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openCountry}
              className={cn(
                'w-full h-14 cursor-pointer relative min-w-0',
                selectedCountry
                  ? 'text-black hover:text-black'
                  : 'text-muted-foreground hover:text-muted-foreground',
              )}
            >
              <span className="flex-1 min-w-0 pr-5">
                <MarqueeText speed={3}>
                  {selectedCountry ? (
                    <div className="flex gap-1.5 items-center">
                      {selectedCountry}
                      {selectedRegion && (
                        <>
                          <MoveRight />
                          {
                            countries
                              ?.find((e) => e.name === selectedCountry)
                              ?.regions.find(
                                (e) => e.id === Number(selectedRegion),
                              )?.name
                          }
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-1.5">{t('Mamlakat tanlang')}</div>
                  )}
                </MarqueeText>
              </span>

              <LocationOnIcon
                sx={{
                  position: 'absolute',
                  color: '#121212',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </Button>
          </PopoverTrigger>

          <AnimatePresence>
            {openCountry && (
              <PopoverContent
                align="start"
                className="p-0 w-[var(--radix-popover-trigger-width)]"
              >
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full p-0 bg-white rounded-md shadow-lg overflow-hidden"
                >
                  <Command>
                    <CommandInput
                      placeholder={t('Qidirish')}
                      value={selectedCountry ? searchRegion : searchCountry}
                      onChange={(e) =>
                        selectedCountry
                          ? setSearchRegion(e.target.value)
                          : setSearchCountry(e.target.value)
                      }
                    />
                    {selectedCountry && (
                      <motion.div
                        key="change-country-btn"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Button
                          variant={'ghost'}
                          onClick={() => {
                            setSelectedCountry('');
                            setSelectedRegion('');
                          }}
                          className="mt-1"
                        >
                          <MoveLeft className="size-5" />
                          {t('Boshqa davlat tanlash')}
                        </Button>
                      </motion.div>
                    )}
                    <CommandList className="px-1 gap-2">
                      {defaultitems?.length ? (
                        defaultitems.map((item) => (
                          <AnimatePresence key={selectedCountry + item.id}>
                            <motion.div
                              key={selectedCountry + item.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.2 }}
                              layout
                            >
                              <CommandItem
                                onClick={() => {
                                  if (selectedCountry) {
                                    setSelectedRegion(String(item.id));
                                    setSelectedDestRegions(String(item.id));
                                    setOpenCountry(false);
                                  } else {
                                    setSelectedCountry(item.name);
                                  }
                                }}
                              >
                                {item.name}
                              </CommandItem>
                            </motion.div>
                          </AnimatePresence>
                        ))
                      ) : selectedCountry ? (
                        <CommandEmpty>{t('Shahar topilmadi')}</CommandEmpty>
                      ) : isLoading ? (
                        <div className="py-6 text-center">
                          <Loader2 className="animate-spin" />
                        </div>
                      ) : (
                        <CommandEmpty>{t('Davlat topilmadi')}</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      </div>

      <div className="flex flex-col relative gap-2 h-full">
        <Label className="text-md">{t('Куда')}</Label>

        <Popover open={openDest} onOpenChange={setOpenDest}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openDest}
              className={cn(
                'w-full h-14 cursor-pointer relative min-w-0',
                selectedDestCountry
                  ? 'text-black hover:text-black'
                  : 'text-muted-foreground hover:text-muted-foreground',
              )}
            >
              <span className="flex-1 min-w-0 pr-5">
                <MarqueeText speed={3}>
                  {selectedDestCountry ? (
                    <div className="flex gap-1.5 items-center">
                      {selectedDestCountry}
                      {selectedDestRegion && (
                        <>
                          <MoveRight />
                          {
                            countries
                              ?.find((e) => e.name === selectedDestCountry)
                              ?.regions.find(
                                (e) => e.id === Number(selectedDestRegion),
                              )?.name
                          }
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-1.5">{t('Mamlakat tanlang')}</div>
                  )}
                </MarqueeText>
              </span>

              <AirplanemodeActiveIcon
                sx={{
                  position: 'absolute',
                  color: 'black',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </Button>
          </PopoverTrigger>

          <AnimatePresence>
            {openDest && (
              <PopoverContent
                align="start"
                className="p-0 w-[var(--radix-popover-trigger-width)]"
              >
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full p-0 bg-white rounded-md shadow-lg overflow-hidden"
                >
                  <Command>
                    <CommandInput
                      placeholder={t('Qidirish')}
                      value={
                        selectedDestCountry
                          ? searchDestRegion
                          : searchDestCountry
                      }
                      onChange={(e) =>
                        selectedDestCountry
                          ? setSearchDestRegion(e.target.value)
                          : setSearchDestCountry(e.target.value)
                      }
                    />
                    {selectedDestCountry && (
                      <motion.div
                        key="change-country-btn"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Button
                          variant={'ghost'}
                          onClick={() => {
                            setSelectedDestCountry('');
                            setSelectedDestRegion('');
                          }}
                          className="mt-1"
                        >
                          <MoveLeft className="size-5" />
                          {t('Boshqa davlat tanlash')}
                        </Button>
                      </motion.div>
                    )}
                    <CommandList className="px-1 gap-2">
                      {itemsDes?.length ? (
                        itemsDes.map((item) => (
                          <AnimatePresence key={selectedDestCountry + item.id}>
                            <motion.div
                              key={selectedDestCountry + item.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.2 }}
                              layout
                            >
                              <CommandItem
                                onClick={() => {
                                  if (selectedDestCountry) {
                                    setSelectedDestRegion(String(item.id));
                                    setOpenDest(false);
                                  } else {
                                    setSelectedDestCountry(item.name);
                                  }
                                }}
                              >
                                {item.name}
                              </CommandItem>
                            </motion.div>
                          </AnimatePresence>
                        ))
                      ) : selectedDestCountry ? (
                        <CommandEmpty>{t('Shahar topilmadi')}</CommandEmpty>
                      ) : isLoading ? (
                        <div className="py-6 text-center">
                          <Loader2 className="animate-spin" />
                        </div>
                      ) : (
                        <CommandEmpty>{t('Davlat topilmadi')}</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      </div>
      <div className="relative gap-2 h-full ">
        <div
          onClick={() => setDataOpen(!dataOpen)}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md text-[#121212]">
            {t('Дата отправления')}
          </Label>
          <div className="relative">
            <Input
              className="h-14 text-md placeholder:text-[#A3A3A3]"
              placeholder={t('Когда')}
              value={selectData}
              readOnly
            />
            <CalendarMonthIcon
              sx={{
                position: 'absolute',
                color: 'black',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
              }}
            />
          </div>
        </div>

        {dataOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDataOpen(false)}
            />
            <ArrowDropUpOutlinedIcon
              sx={{
                position: 'absolute',
                top: '85px',
                zIndex: 50,
                fontSize: '32px',
                color: 'white',
              }}
            />
            <div
              className="absolute top-[105px] border shadow-2xl rounded-2xl bg-white z-40 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 items-center">
                <Input
                  placeholder={t('Когда')}
                  value={
                    fromDate ? formatDate.format(fromDate, 'DD/MM/YYYY') : ''
                  }
                  readOnly
                  className="w-full text-[#121212] h-[50px] placeholder:text-[#121212]"
                />
                <ArrowRightAltIcon
                  color="action"
                  sx={{ width: '28px', height: '28px' }}
                />
                <Input
                  placeholder={t('Выезд')}
                  value={toDate ? formatDate.format(toDate, 'DD/MM/YYYY') : ''}
                  readOnly
                  disabled={!fromDate}
                  className={clsx(
                    'w-full text-black h-[50px]',
                    fromDate
                      ? 'placeholder:text-[#121212]'
                      : 'placeholder:text-[#A3A3A3]',
                  )}
                />
              </div>
              <div className="flex gap-2 border-t-2 p-2 border-b-2 mt-5">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(val) => {
                    setRange(val);
                    setFromDate(val?.from);
                    setToDate(val?.to);
                  }}
                  numberOfMonths={2}
                  className="text-[#212122]"
                />
              </div>
              <div className="grid grid-cols-2 mt-5 gap-2">
                <button
                  className="bg-[#ECF2FF] rounded-3xl p-3 text-[#084FE3] cursor-pointer"
                  onClick={() => {
                    setDataOpen(false);
                    setFromDate(undefined);
                    setToDate(undefined);
                    setRange(undefined);
                    setSelectData('');
                  }}
                >
                  {t('Отмена')}
                </button>
                <button
                  className="bg-[#1764FC] rounded-3xl text-[#FFFFFF] cursor-pointer"
                  onClick={() => {
                    setDataOpen(false);
                    if (fromDate && toDate) {
                      setSelectData(
                        `${formatDate.format(fromDate, 'DD/MM/YYYY')} - ${formatDate.format(
                          toDate,
                          'DD/MM/YYYY',
                        )}`,
                      );
                    } else {
                      setSelectData('');
                    }
                  }}
                >
                  {t('Применять')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative gap-2 h-full ">
        <div
          onClick={() => setAgeOpen(!ageOpen)}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md text-[#121212]">
            {t('Туристы')}
          </Label>
          <div className="relative">
            <Input
              className="h-14 text-md placeholder:text-md placeholder:text-[#A3A3A3]"
              placeholder={t('Туристы')}
              value={selectAge === 0 ? '' : selectAge}
              readOnly
            />
          </div>
        </div>

        {ageOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setAgeOpen(false)}
            />
            <ArrowDropUpOutlinedIcon
              sx={{
                position: 'absolute',
                top: '85px',
                zIndex: 50,
                fontSize: '32px',
                color: 'white',
              }}
            />
            <div
              className="absolute top-[105px] border shadow-2xl rounded-2xl bg-white z-40 p-2 px-4 w-96 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between">
                <Label className="flex flex-col gap-0 items-start">
                  <p className="font-semibold text-lg text-[#212122]">
                    {t('Вызрослых')}
                  </p>
                  <p className="text-sm text-[#909091]">{t('старше 13 лет')}</p>
                </Label>
                <div className="grid grid-cols-3 border justify-center items-center rounded-lg w-48">
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setAdults((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                  >
                    <RemoveIcon className="text-[#084FE3]" />
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="border-x-2 text-lg text-[#212122] h-full rounded-none"
                  >
                    {adults}
                  </Button>
                  <Button
                    variant={'ghost'}
                    onClick={() => setAdults((prev) => prev + 1)}
                  >
                    <AddIcon className="text-[#084FE3]" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-5">
                <Label className="flex flex-col gap-0 items-start">
                  <p className="font-semibold text-lg text-[#212122]">
                    {t('Дети')}
                  </p>
                  <p className="text-sm text-[#909091]">{t('до 13 лет')}</p>
                </Label>
                <div className="grid grid-cols-3 border justify-center items-center rounded-lg w-48">
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setChildren((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                  >
                    <RemoveIcon className="text-[#084FE3]" />
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="border-x-2 text-lg h-full rounded-none text-[#212122]"
                  >
                    {children}
                  </Button>
                  <Button
                    variant={'ghost'}
                    onClick={() => setChildren((prev) => prev + 1)}
                  >
                    <AddIcon className="text-[#084FE3]" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex h-full items-end">
        <Button
          className="bg-[#1764FC] cursor-pointer hover:bg-[#1764FC] text-lg text-white h-14 w-full flex items-center justify-center rounded-4xl font-semibold"
          onClick={saveFilter}
        >
          <p>{t('Искать туры')}</p>
        </Button>
      </div>
    </div>
  );
};

export default FilterTours;
