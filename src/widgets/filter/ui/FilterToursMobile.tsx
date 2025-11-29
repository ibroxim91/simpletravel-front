import { useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { location_api } from '@/widgets/navbar/lib/api';
import AddIcon from '@mui/icons-material/Add';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const FilterToursMobile = () => {
  const t = useTranslations();
  const route = useRouter();
  const searchParams = useSearchParams();
  const [openCityMobile, setOpenCityMobile] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [whereMobile, setWhereMobile] = useState(false);
  const [dataOpenMobile, setDataOpenMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [selectAge, setSelectAge] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWhere, setSelectedWhere] = useState('');
  const [searchWhere, setSearchWhere] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectData, setSelectData] = useState<string>('');
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [range, setRange] = useState<DateRange | undefined>();
  const [cities, setCities] = useState<string[] | []>([]);
  const [citiesWhere, setCitiesWhere] = useState<string[] | []>([]);

  const { data: ticket } = useQuery({
    queryKey: ['location_list'],
    queryFn: () => location_api.location_list(),
    select(data) {
      return data.data.data;
    },
  });

  useEffect(() => {
    if (ticket) {
      const uniqueCities = Array.from(
        new Set(ticket.departures.slice(0, 8).map((e) => e)),
      );
      setCities(uniqueCities);

      const uniqueCitiesWhere = Array.from(
        new Set(ticket.destinations.slice(0, 8).map((e) => e)),
      );
      setCitiesWhere(uniqueCitiesWhere);
    }
  }, [ticket]);

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredCitiesWhere = citiesWhere.filter((c) =>
    c.toLowerCase().includes(searchWhere.toLowerCase()),
  );

  useEffect(() => {
    const departure = searchParams.get('departure');
    const destination = searchParams.get('destination');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');

    setSearch(departure || '');
    setSearchWhere(destination || '');
    setFromDate(dateFrom ? new Date(dateFrom) : undefined);
    setToDate(dateTo ? new Date(dateTo) : undefined);
    setAdults(adultsParam ? parseInt(adultsParam) : 0);
    setChildren(childrenParam ? parseInt(childrenParam) : 0);
  }, [searchParams]);

  const saveFilter = () => {
    const params = new URLSearchParams();

    if (search) params.set('departure', search);
    if (searchWhere) params.set('destination', searchWhere);
    if (fromDate)
      params.set('dateFrom', formatDate.format(fromDate, 'YYYY-MM-DD'));
    if (toDate) params.set('dateTo', formatDate.format(toDate, 'YYYY-MM-DD'));
    if (adults > 0) params.set('adults', adults.toString());
    if (children > 0) params.set('children', children.toString());

    route.push(`/selectour?page=1&${params.toString()}`);
  };

  return (
    <div className="mt-10 bg-white shadow-sm py-4 gap-4 w-full rounded-3xl grid grid-cols-1 items-center px-10 min-lg:hidden font-medium">
      <div className="relative flex gap-2 h-full">
        <div
          onClick={() => setOpenCityMobile(!openCityMobile)}
          className="cursor-pointer flex flex-col w-full gap-2"
        >
          <Label className="font-semibold text-md ">{t('Откуда')}</Label>
          <div className="relative w-full">
            <Input
              className="h-[60px] text-md placeholder:text-md"
              placeholder={t('Откуда')}
              value={search || selectedCity}
              readOnly
            />
            <LocationOnIcon
              sx={{
                position: 'absolute',
                color: 'black',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
        <Drawer
          anchor="bottom"
          open={openCityMobile}
          onClose={() => setOpenCityMobile(false)}
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
          <div className="flex flex-col gap-4 w-full font-medium">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{t('Выберите город')}</p>
              <Button
                variant={'outline'}
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                onClick={() => setOpenCityMobile(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder={t('Укажите город')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCity(e.target.value);
                }}
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
                    className="p-2 hover:bg-gray-200 rounded-lg text-black items-center cursor-pointer flex justify-between"
                    onClick={() => {
                      setSelectedCity(cityName);
                      setSearch(cityName);
                      setOpenCityMobile(false);
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

      <div className="relative flex gap-2 h-full ">
        <div
          onClick={() => setWhereMobile(!whereMobile)}
          className="cursor-pointer flex flex-col gap-2 w-full"
        >
          <Label className="font-semibold text-md">{t('Куда')}</Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md"
              placeholder={t('Страна, курорт')}
              value={searchWhere || selectedWhere}
              readOnly
            />
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
          </div>
        </div>
        <Drawer
          anchor="bottom"
          className=""
          onClose={() => setWhereMobile(false)}
          open={whereMobile}
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
          <div className="flex flex-col gap-4 w-full font-medium">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{t('Выберите город')}</p>
              <Button
                variant={'outline'}
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                onClick={() => setWhereMobile(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder={t('Укажите город')}
                value={searchWhere}
                onChange={(e) => {
                  setSearchWhere(e.target.value);
                  setSelectedWhere(e.target.value);
                }}
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
              {filteredCitiesWhere.length > 0 ? (
                filteredCitiesWhere.map((cityName) => (
                  <div
                    key={cityName}
                    className="p-2 hover:bg-gray-200 rounded-lg text-black items-center cursor-pointer flex justify-between"
                    onClick={() => {
                      setSelectedWhere(cityName);
                      setSearchWhere(cityName);
                      setWhereMobile(false);
                    }}
                  >
                    {cityName}
                    {cityName === selectedWhere && (
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

      <div className="relative flex gap-2 h-full">
        <div
          onClick={() => {
            setDataOpenMobile(!dataOpenMobile);
          }}
          className="cursor-pointer flex flex-col gap-2 w-full"
        >
          <Label className="font-semibold text-md">
            {t('Дата отправления')}
          </Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md"
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
                  onSelect={(val: any) => {
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

      <div className="relative flex gap-2 h-full">
        <div
          onClick={() => setAgeOpen(!ageOpen)}
          className="cursor-pointer flex flex-col w-full gap-2"
        >
          <Label className="font-semibold text-md">{t('Туристы')}</Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md"
              placeholder={t('Вызрослых')}
              value={selectAge === 0 ? '' : selectAge}
              readOnly
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
      <div className="flex flex-col gap-2">
        <Button
          className="bg-blue-600 text-lg text-white h-[60px] flex items-center justify-center rounded-4xl text-center font-semibold cursor-pointer"
          onClick={saveFilter}
        >
          <p>{t('Искать туры')}</p>
        </Button>
      </div>
    </div>
  );
};

export default FilterToursMobile;
