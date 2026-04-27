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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RemoveIcon from '@mui/icons-material/Remove';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MoveLeft, SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const FilterTours = ({ selectedDestRegions, setSelectedDestRegions,setSelectedDefaulDestination, setHotelRating, setSelectedDurations, setMealPlan,setIsSearchClicked }) => {
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

      const changeDeparture= (newDep: string) => {
      if (window.location.pathname === '/selectour') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('departure', newDep);
       route.replace(`/selectour?${params.toString()}`, { scroll: false });
  } 
   
};
useEffect(() => {
  if (countries) {
    // Default regionni topamiz
    const defaultRegion = countries
      .flatMap((c) => c.regions)
      .find((r) => r.default_region);

    if (defaultRegion) {
      setSelectedDefaulDestination(String(defaultRegion.id));
      changeDeparture(String(defaultRegion.id));
      localStorage.setItem("dest_id", String(defaultRegion.id));
    
    }
  }
}, [countries]);
 

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
    const dateTo = searchParams.get('dateTo');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');
    const departure = searchParams.get('departure') ||  '';
    const dateFrom = searchParams.get('dateFrom') || '';

    const town = searchParams.get('town') || '';
    const hotel_id = searchParams.get('hotel_id') || '';
    const operator = searchParams.get('operator') || '';
    const mealPlan = searchParams.get('meal') || '';
    const rating = searchParams.get('rating') || '';
    const duration = searchParams.get('duration') || '';
    const from_cache = searchParams.get('from_cache') || '';

    let newData = {
      departure:departure,
      from_cache:from_cache,
      destination:destination,
      dateFrom:dateFrom,
      dateTo:dateTo,
      duration:duration,
      town:town,
      rating:rating,
      hotel_id:hotel_id,
      mealPlan:mealPlan,
      adults:adultsParam,
      children:childrenParam,
      operator:operator,
      
   }
   localStorage.setItem('filterTours', JSON.stringify(newData));

		
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
    if (!selectedRegion || !selectedDestRegion) {
      toast.error("Avval davlat va shaharni tanlang!");
      return;
    }
    localStorage.removeItem('town')
    localStorage.removeItem('mealPlan')
    setHotelRating(null)
    setSelectedDurations(null)
    setMealPlan(null)
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
        const cachedDestId = localStorage.getItem('dest_id');
        if (cachedDestId) {
          params.set('destination', cachedDestId);
        } else {
          params.set('destination', selectedDestRegion);
        }
      } else {
        params.set('destination', selectedDestCountry);
      }
    }



    if (fromDate) params.set('dateFrom', formatDate.format(fromDate, 'YYYY-MM-DD'));
    if (toDate) params.set('dateTo', formatDate.format(toDate, 'YYYY-MM-DD'));
    if (adults > 0) params.set('adults', adults.toString());
    if (children > 0) params.set('children', children.toString());
    if (searchParams.get('hotel_id')) params.delete('hotel_id');
    if (searchParams.get('town')) params.delete('town');
    if (searchParams.get('rating')) params.delete('rating');
    if (searchParams.get('duration')) params.delete('duration');
    if (searchParams.get('meal')) params.delete('meal');

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

  const selectedDepartureRegionName = countries
    ?.find((e) => e.name === selectedCountry)
    ?.regions.find((e) => e.id === Number(selectedRegion))?.name;

  const selectedDestinationRegionName = countries
    ?.find((e) => e.name === selectedDestCountry)
    ?.regions.find((e) => e.id === Number(selectedDestRegion))?.name;

  const departureCode = selectedDepartureRegionName
    ? selectedDepartureRegionName.toLowerCase() === 'ташкент'
      ? 'TAS'
      : selectedDepartureRegionName.slice(0, 3).toUpperCase()
    : '';


  return (
    <div className="mt-0 hidden h-[101px] w-full max-w-[1240px] font-medium lg:relative lg:flex">
      <div className="absolute left-0 top-0 flex w-full items-start gap-6">
      <div className="grid h-[60px] w-[924px] grid-cols-4 rounded-[14px] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <div className="relative flex h-full flex-col rounded-l-[14px] border-r border-[#E5E7EB]">
        <Label className="sr-only">{t('Откуда')}</Label>
        <Popover open={openCountry} onOpenChange={setOpenCountry}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openCountry}
              className={cn(
                'w-full  h-[60px] cursor-pointer relative min-w-0 !rounded-none border-0 px-6 shadow-none hover:!rounded-none hover:bg-transparent focus-visible:!rounded-none data-[state=open]:!rounded-none',
                selectedCountry
                  ? 'text-[#7B8DA1] hover:text-[#7B8DA1]'
                  : 'text-[#6B7280] hover:text-[#6B7280]',
              )}
            >
              <span className="flex-1 min-w-0 pr-5">
                <MarqueeText speed={3}>
                  {selectedDepartureRegionName ? (
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[#7B8DA1]">{departureCode} ·</span>
                      <span className="text-[#1C1C1E]">{selectedDepartureRegionName}</span>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">{t('Откуда')}</div>
                  )}
                </MarqueeText>
              </span>

              <LocationOnIcon
                sx={{
                  color: '#1A73E8',
                  width: '16px',
                  height: '16px',
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

      <div className="flex flex-col relative h-full border-r border-[#E5E7EB]">
        <Label className="sr-only">{t('Куда')}</Label>

        <Popover open={openDest} onOpenChange={setOpenDest}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openDest}
              className={cn(
                'w-full h-[60px] cursor-pointer relative min-w-0 !rounded-l-[14px] !rounded-r-none border-0 px-6 shadow-none hover:!rounded-l-[14px] hover:!rounded-r-none hover:bg-transparent focus-visible:!rounded-l-[14px] focus-visible:!rounded-r-none data-[state=open]:!rounded-l-[14px] data-[state=open]:!rounded-r-none',
                selectedDestCountry
                  ? 'text-[#6B7280] hover:text-[#6B7280]'
                  : 'text-[#6B7280] hover:text-[#6B7280]',
              )}
            >
              <span className="flex-1 min-w-0 pr-5">
                <MarqueeText speed={3}>
                  {selectedDestinationRegionName ? (
                    <div className="flex gap-1.5 items-center">
                      {selectedDestinationRegionName}
                    </div>
                  ) : (
                    <div className="flex gap-1.5">{t('Куда')}</div>
                  )}
                </MarqueeText>
              </span>

              <AirplanemodeActiveIcon
                sx={{
                  color: '#1A73E8',
                  width: '16px',
                  height: '16px',
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
                                     setSelectedDestRegions(String(item.id));
                                     localStorage.setItem("dest_id", String(item.id))
                                   
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
      <div className="relative h-full border-r border-[#E5E7EB]">
        <div
          onClick={() => setDataOpen(!dataOpen)}
          className="cursor-pointer flex h-[60px] items-center justify-between px-6"
        >
          <Input
            className="h-auto border-0 p-0 text-[14px] font-medium text-[#6B7280] shadow-none placeholder:text-[#6B7280] focus-visible:ring-0"
            placeholder={t('Когда')}
            value={selectData}
            readOnly
          />
          <CalendarMonthIcon sx={{ color: '#1A73E8', width: '16px', height: '16px' }} />
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

      <div className="relative h-full">
        <div
          onClick={() => setAgeOpen(!ageOpen)}
          className="cursor-pointer flex h-[60px] items-center justify-between px-6"
        >
          <Input
            className="h-auto border-0 p-0 text-[14px] font-medium text-[#1C1C1E] shadow-none placeholder:text-[#1C1C1E] focus-visible:ring-0"
            placeholder={t('1 пассажир')}
            value={selectAge === 0 ? '' : `${selectAge} ${t('пассажир')}`}
            readOnly
          />
          <KeyboardArrowDownIcon sx={{ color: '#1A73E8', width: '16px', height: '16px' }} />
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

      </div>
      <div className="flex h-[60px] w-[292px] items-end">
        <Button
          className="h-[60px] w-full cursor-pointer rounded-[14px] bg-[#FF6B00] px-[10px] text-base font-normal leading-[19px] text-white hover:bg-[#ff7a1f]"
          // onClick={saveFilter}
            onClick={() => {
              saveFilter()
              if (selectedDestRegion && selectedRegion) {
                setIsSearchClicked(true);
              } else {
                toast.error("Avval shaharni tanlang!");
              }
            }}
        >
          <span className="flex items-center gap-4">
            <SearchIcon className="size-6" />
            <p>{t('Искать тур')}</p>
          </span>
        </Button>
      </div>
      </div>
      <p className="absolute right-1 top-[84px] text-right text-[14px] font-normal leading-[17px] text-white">
        {t('Переходи в раздел “Подобрать тур”, чтобы ознакомиться со всеми турами')}
      </p>
    </div>
  );
};

export default FilterTours;
