import { country_api, CountryListData } from '@/shared/config/api/country';
import { useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { MarqueeText } from '@/shared/ui/MarqueeTex';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import AddIcon from '@mui/icons-material/Add';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import { MoveLeft, MoveRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const FilterToursMobile = ({ selectedDestRegions, setSelectedDestRegions,setSelectedDefaulDestination, setHotelRating, setSelectedDurations, setMealPlan }) => {
  const { data: ticket } = useQuery({
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
  if (ticket) {
    // Default regionni topamiz
    const defaultRegion = ticket
      .flatMap((c) => c.regions)
      .find((r) => r.default_region);

    if (defaultRegion) {
      setSelectedDefaulDestination(String(defaultRegion.id));
      changeDeparture(String(defaultRegion.id));
      localStorage.setItem("dest_id", String(defaultRegion.id));
    
    }
  }
}, [ticket]);

  const defaultCountry = ticket?.find((c) => c.default_country === true);
  const t = useTranslations();
  const route = useRouter();
  const searchParams = useSearchParams();
  const [ageOpen, setAgeOpen] = useState(false);
  const [dataOpenMobile, setDataOpenMobile] = useState(false);
  const [selectAge, setSelectAge] = useState<number>(0);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectData, setSelectData] = useState<string>('');
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [range, setRange] = useState<DateRange | undefined>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchRegion, setSearchRegion] = useState('');
  const [selectedCountry, setSelectedCountry] =
    useState<CountryListData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [openDrawerDes, setOpenDrawerDes] = useState(false);
  const [searchCountryDes, setSearchCountryDes] = useState('');
  const [searchRegionDes, setSearchRegionDes] = useState('');
  const [selectedCountryDes, setSelectedCountryDes] =
    useState<CountryListData | null>(null);
  const [selectedRegionDes, setSelectedRegionDes] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const filteredCountries =
    (ticket &&
      ticket.filter((c) =>
        c.name.toLowerCase().includes(searchCountry.toLowerCase()),
      )) ||
    [];

  const filteredRegions =
    defaultCountry?.regions.filter((r) =>
      r.name.toLowerCase().includes(searchRegion.toLowerCase()),
    ) || [];

  const filteredCountriesDes =
    (ticket &&
      ticket.filter((c) =>
        c.name.toLowerCase().includes(searchCountryDes.toLowerCase()),
      )) ||
    [];

  const filteredRegionsDes =
    selectedCountryDes?.regions.filter((r) =>
      r.name.toLowerCase().includes(searchRegionDes.toLowerCase()),
    ) || [];

  useEffect(() => {
    const departure = searchParams.get('departure');
    const destination = searchParams.get('destination');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');

    if (departure && ticket) {
      const regionId = parseInt(departure, 10);
      const region = defaultCountry?.regions.find((r) => r.id === regionId);
      if (region) {
        setSelectedCountry(defaultCountry);
        setSelectedRegion(region);
      }
    } else if (defaultCountry && !selectedCountry) {
      setSelectedCountry(defaultCountry);
      const defaultRegion = defaultCountry.regions?.find((r) => r.default_region === true);
      if (defaultRegion) {
        setSelectedRegion(defaultRegion);
      }
    }

    if (destination && ticket) {
      const regionId = parseInt(destination, 10);
      for (const country of ticket) {
        const region = country.regions.find((r) => r.id === regionId);
        if (region) {
          setSelectedCountryDes(country);
          setSelectedRegionDes(region);
          break;
        }
      }
    }

    setFromDate(dateFrom ? new Date(dateFrom) : undefined);
    setToDate(dateTo ? new Date(dateTo) : undefined);
    setAdults(adultsParam ? parseInt(adultsParam) : 0);
    setChildren(childrenParam ? parseInt(childrenParam) : 0);
  }, [searchParams, ticket, defaultCountry, selectedCountry]);

  const saveFilter = () => {
    if (!selectedRegion || !selectedRegionDes) {
      toast.error("Avval davlat va shaharni tanlang!");
      return;
    }
    const params = new URLSearchParams();
    
    localStorage.removeItem('town')
    localStorage.removeItem('mealPlan')
    setHotelRating(null)
    setSelectedDurations(null)
    setMealPlan(null)
    
    if (selectedRegion) params.set('departure', String(selectedRegion.id));
    if (selectedRegionDes)
      params.set('destination', String(selectedRegionDes.id));
    if (fromDate)
      params.set('dateFrom', formatDate.format(fromDate, 'YYYY-MM-DD'));
    if (toDate) params.set('dateTo', formatDate.format(toDate, 'YYYY-MM-DD'));
    if (adults > 0) params.set('adults', adults.toString());
    if (children > 0) params.set('children', children.toString());
    if (searchParams.get("hotel_id")) params.set('hotel_id', "");
    if (searchParams.get("town")) params.set('town', "");
    if (searchParams.get("rating")) params.set('rating',  "");
    if (searchParams.get("duration")) params.set('duration',  "");
    if (searchParams.get("meal")) params.set('meal',  "");

    route.push(`/selectour?page=1&${params.toString()}`,  { scroll: false });
  };

  const departureRegionName = selectedRegion?.name ?? '';
  const departureCode = departureRegionName
    ? departureRegionName.toLowerCase() === 'ташкент'
      ? 'TAS'
      : departureRegionName.slice(0, 3).toUpperCase()
    : '';

  return (
    <div className="w-full min-lg:hidden font-medium">
      <div className="grid w-full grid-cols-2 overflow-hidden rounded-[14px] bg-white shadow-sm">
      <div className="relative col-span-2 flex flex-col gap-0">
        <div
          onClick={() => {
            setOpenDrawer(true);
            setSearchCountry('');
            setSearchRegion('');
          }}
          className="cursor-pointer w-full"
        >
          <div className="relative w-full">
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openDrawer}
              className={cn(
                'h-12 w-full min-w-0 cursor-pointer rounded-none border-0 border-b border-[#E5E7EB] px-5 py-4',
                departureRegionName
                  ? 'text-[#1C1C1E] hover:text-[#1C1C1E]'
                  : 'text-muted-foreground hover:text-muted-foreground',
              )}
            >
              <span className="flex-1 min-w-0 pr-5">
                <MarqueeText speed={3}>
                  {departureRegionName ? (
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[#7B8DA1]">{departureCode} ·</span>
                      <span className="text-[#1C1C1E]">{departureRegionName}</span>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">{t('Mamlakat tanlang')}</div>
                  )}
                </MarqueeText>
              </span>

              <LocationOnIcon
                sx={{
                  position: 'absolute',
                  color: '#1A73E8',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </Button>
          </div>
        </div>

        <Drawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 2,
              width: '100%',
              overflow: 'auto',
              minHeight: '70%',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <div className="flex flex-col gap-4 w-full font-medium">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{t('Выберите город')}</p>
              <Button
                variant="outline"
                className="rounded-full h-[40px] w-[40px]"
                onClick={() => setOpenDrawer(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder={t('Укажите регион')}
                value={searchRegion}
                onChange={(e) => setSearchRegion(e.target.value)}
                className="w-full pl-10 text-black"
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
            <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto">
              {filteredRegions.length ? (
                filteredRegions.map((region) => (
                  <div
                    key={region.id}
                    className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between"
                    onClick={() => {
                      setSelectedRegion(region);
                      setSearchRegion(region.name);
                      setOpenDrawer(false);
                    }}
                  >
                    {region.name}
                    {selectedRegion?.id === region.id && (
                      <DoneIcon sx={{ width: '14px', height: '14px' }} />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-2 text-black h-screen flex justify-center items-end">
                  {t('Не найдено')}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>

      <div className="relative col-span-2 flex flex-col gap-0">
        <div
          onClick={() => {
            setOpenDrawerDes(true);
            setSearchCountryDes('');
            setSearchRegionDes('');
          }}
          className="cursor-pointer w-full"
        >
          <div className="relative w-full">
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openDrawerDes}
              className={cn(
                'h-12 w-full min-w-0 cursor-pointer rounded-none border-0 border-b border-[#E5E7EB] px-5 py-4',
                selectedCountryDes
                  ? 'text-[#1C1C1E] hover:text-[#1C1C1E]'
                  : 'text-[#7B8DA1] hover:text-[#7B8DA1]',
              )}
            >
              <span className="flex-1 min-w-0 pr-5">
                <MarqueeText speed={3}>
                  {selectedCountryDes ? (
                    <div className="flex gap-1.5 items-center">
                      {selectedCountryDes.name}
                      {selectedRegionDes && (
                        <>
                          <MoveRight />
                          {
                            ticket
                              ?.find((e) => e.name === selectedCountryDes.name)
                              ?.regions.find(
                                (e) => e.id === Number(selectedRegionDes.id),
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
                  color: '#1A73E8',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </Button>
          </div>
        </div>

        <Drawer
          anchor="bottom"
          open={openDrawerDes}
          onClose={() => setOpenDrawerDes(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 2,
              width: '100%',
              overflow: 'auto',
              minHeight: '70%',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <div className="flex flex-col gap-4 w-full font-medium">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{t('Выберите город')}</p>
              <Button
                variant="outline"
                className="rounded-full h-[40px] w-[40px]"
                onClick={() => setOpenDrawerDes(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>
            {selectedCountryDes ? (
              <>
                <div className="relative">
                  <Input
                    placeholder={t('Укажите регион')}
                    value={searchRegionDes}
                    onChange={(e) => setSearchRegionDes(e.target.value)}
                    className="w-full pl-10 text-black"
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
                <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto">
                  <Button
                    variant={'ghost'}
                    onClick={() => {
                      setSelectedCountryDes(null);
                      setSelectedRegionDes(null);
                      setSearchCountryDes('');
                      setSearchRegionDes('');
                    }}
                    className="mt-1 w-fit"
                  >
                    <MoveLeft className="size-5" />
                    {t('Boshqa davlat tanlash')}
                  </Button>
                  {filteredRegionsDes.length ? (
                    filteredRegionsDes.map((region) => (
                      <div
                        key={region.id}
                        className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between"
                        onClick={() => {
                          setSelectedRegionDes(region);
                          setSearchRegionDes(region.name);
                          setOpenDrawerDes(false);
                        }}
                      >
                        {region.name}
                        {selectedRegionDes?.id === region.id && (
                          <DoneIcon sx={{ width: '14px', height: '14px' }} />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-black h-screen flex justify-center items-end">
                      {t('Не найдено')}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Input
                    placeholder={t('Укажите страну')}
                    value={searchCountryDes}
                    onChange={(e) => setSearchCountryDes(e.target.value)}
                    className="w-full text-black pl-10"
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

                <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
                  {filteredCountriesDes.length ? (
                    filteredCountriesDes.map((country) => (
                      <div
                        key={country.id}
                        className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between"
                        onClick={() => {
                          setSelectedCountryDes(country);
                          setSelectedRegionDes(null);
                          setSearchCountryDes(country.name);
                        }}
                      >
                        {country.name}
                        {selectedCountryDes === country.id && (
                          <DoneIcon sx={{ width: '14px', height: '14px' }} />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-black h-screen flex justify-center items-end">
                      {t('Не найдено')}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Drawer>
      </div>

      <div className="relative h-full border-r border-[#E5E7EB]">
        <div
          onClick={() => {
            setDataOpenMobile(!dataOpenMobile);
          }}
          className="cursor-pointer w-full"
        >
          <div className="relative">
            <Input
              className="h-12 rounded-none border-0 px-5 text-[14px] font-medium text-[#7B8DA1] placeholder:text-[14px] placeholder:text-[#7B8DA1]"
              placeholder={t('Когда')}
              value={selectData}
              readOnly
            />
            <CalendarMonthIcon
              sx={{
                position: 'absolute',
                color: '#1A73E8',
                top: '50%',
                right: '20px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
        <Sheet open={dataOpenMobile} onOpenChange={setDataOpenMobile}>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl !h-[90vh] p-0 flex flex-col"
            style={{
              position: 'fixed',
              zIndex: 9999,
            }}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            {/* Fixed Header */}
            <SheetHeader className="flex flex-row items-center justify-between p-4 pb-3 shrink-0">
              <SheetTitle className="text-xl font-semibold">
                {t('Дата отправления')}
              </SheetTitle>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => setDataOpenMobile(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </SheetHeader>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto px-4 pb-4"
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              {/* Inputs */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder={t('Когда')}
                  value={
                    fromDate ? formatDate.format(fromDate, 'DD/MM/YYYY') : ''
                  }
                  readOnly
                  className="h-12"
                />

                <Input
                  placeholder={t('Выезд')}
                  value={toDate ? formatDate.format(toDate, 'DD/MM/YYYY') : ''}
                  disabled={!fromDate}
                  readOnly
                  className="h-12"
                />
              </div>

              {/* Calendar */}
              <div className="w-full">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(val) => {
                    setRange(val);
                    setFromDate(val?.from);
                    setToDate(val?.to);
                  }}
                  numberOfMonths={1}
                  className="rounded-md w-full"
                />
              </div>
            </div>

            {/* Fixed Buttons */}
            <div className="grid grid-cols-2 gap-3 p-4 pt-0 mb-5 shrink-0 bg-white">
              <Button
                variant="outline"
                className="rounded-3xl bg-blue-500/20 text-blue-600"
                onClick={() => {
                  setDataOpenMobile(false);
                  setFromDate(undefined);
                  setToDate(undefined);
                  setRange(undefined);
                  setSelectData('');
                }}
              >
                {t('Отмена')}
              </Button>

              <Button
                className="rounded-3xl bg-blue-600 text-white"
                onClick={() => {
                  setDataOpenMobile(false);
                  if (fromDate && toDate) {
                    setSelectData(
                      `${formatDate.format(fromDate, 'DD/MM/YYYY')} - ${formatDate.format(toDate, 'DD/MM/YYYY')}`,
                    );
                  } else {
                    setSelectData('');
                  }
                }}
              >
                {t('Применять')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative h-full">
        <div
          onClick={() => setAgeOpen(!ageOpen)}
          className="cursor-pointer w-full"
        >
          <div className="relative">
            <Input
              className="h-12 rounded-none border-0 px-5 text-[14px] font-medium text-[#1C1C1E] placeholder:text-[14px] placeholder:text-[#1C1C1E]"
              placeholder={t('Вызрослых')}
              value={selectAge === 0 ? t('1 пассажир') : `${selectAge} ${t('пассажир')}`}
              readOnly
            />
            <KeyboardArrowDownIcon
              sx={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#1A73E8',
                width: '18px',
                height: '18px',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
        <Drawer
          anchor="bottom"
          open={ageOpen}
          onClose={() => setAgeOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 2,
              width: '100%',
              overflow: 'auto',
              minHeight: '70%',
            },
          }}
        >
          <div className="flex flex-col gap-4 w-full h-full font-medium">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{t('Туристы')}</p>
              <Button
                variant={'outline'}
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                onClick={() => setAgeOpen(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>
            <div className="flex justify-between">
              <Label className="flex flex-col gap-0 items-start">
                <p className="font-semibold text-lg">{t('Вызрослых')}</p>
                <p className="text-ring text-sm">{t('старше 13 лет')}</p>
              </Label>
              <div className="grid grid-cols-3 border justify-center items-center rounded-lg w-48">
                <Button
                  variant={'ghost'}
                  className="h-full rounded-tl-lg rounded-bl-lg rounded-br-none rounded-tr-none"
                  onClick={() =>
                    setAdults((prev) => (prev > 0 ? prev - 1 : prev))
                  }
                >
                  <RemoveIcon className="text-blue-600" />
                </Button>
                <Button
                  variant={'ghost'}
                  className="rounded-none border-r-2 h-full border-l-2 text-lg"
                >
                  {adults}
                </Button>
                <Button
                  variant={'ghost'}
                  className="h-full rounded-tl-none rounded-bl-none rounded-br-lg rounded-tr-lg"
                  onClick={() => setAdults((prev) => prev + 1)}
                >
                  <AddIcon className="text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <Label className="flex flex-col gap-0 items-start">
                <p className="font-semibold text-lg">{t('Дети')}</p>
                <p className="text-ring text-sm">{t('до 13 лет')}</p>
              </Label>
              <div className="grid grid-cols-3 border justify-center items-center rounded-lg w-48">
                <Button
                  variant={'ghost'}
                  className="h-full rounded-tl-lg rounded-bl-lg rounded-br-none rounded-tr-none"
                  onClick={() =>
                    setChildren((prev) => (prev > 0 ? prev - 1 : prev))
                  }
                >
                  <RemoveIcon className="text-blue-600" />
                </Button>
                <Button
                  variant={'ghost'}
                  className="rounded-none border-r-2 h-full border-l-2 text-lg"
                >
                  {children}
                </Button>
                <Button
                  variant={'ghost'}
                  className="h-full rounded-tl-none rounded-bl-none rounded-br-lg rounded-tr-lg"
                  onClick={() => setChildren((prev) => prev + 1)}
                >
                  <AddIcon className="text-blue-600" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-1 gap-2">
            <button
              className="bg-blue-600 rounded-3xl p-3 text-white cursor-pointer font-semibold"
              onClick={() => {
                setSelectAge(adults + children);
                setAgeOpen(false);
              }}
            >
              {t('Применять')}
            </button>
          </div>
        </Drawer>
      </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          className="flex h-12 items-center justify-center rounded-[14px] bg-[#FF6B00] text-center text-[14px] font-medium text-white hover:bg-[#ff7a1f]"
         onClick={() => {
            saveFilter();
            // sahifani pastga siljitish
            window.scrollTo({
              top: 700, // kerakli balandlikka moslab qo‘y
              behavior: 'smooth',
            });
          }}
        >
          <p>{t('Искать тур')}</p>
        </Button>
        <p className="mt-4 text-right text-[12px] font-normal leading-[100%] text-white">
          {t('Переходи в раздел “Подобрать тур”, чтобы ознакомиться со всеми турами')}
        </p>
      </div>
    </div>
  );
};

export default FilterToursMobile;
