import { useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import Ticket_Api from '@/widgets/selectour/lib/api';
import AddIcon from '@mui/icons-material/Add';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const FilterTours = () => {
  const t = useTranslations();
  const route = useRouter();

  const [openCity, setOpenCity] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [where, setWhere] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWhere, setSelectedWhere] = useState('');
  const [searchWhere, setSearchWhere] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectData, setSelectData] = useState<string>('');
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const selectAge = adults + children;
  const [range, setRange] = useState<DateRange | undefined>();
  const [cities, setCities] = useState<string[] | []>([]);
  const [citiesWhere, setCitiesWhere] = useState<string[] | []>([]);

  const { data: ticket } = useQuery({
    queryKey: ['ticket_all'],
    queryFn: () =>
      Ticket_Api.GetAllTickets({
        params: { page: 1, page_size: 8 },
      }),
  });

  useEffect(() => {
    if (ticket) {
      const uniqueCities = Array.from(
        new Set(
          ticket.data.results.tickets.slice(0, 8).map((e) => e.departure),
        ),
      );
      setCities(uniqueCities);

      const uniqueCitiesWhere = Array.from(
        new Set(
          ticket.data.results.top_destinations
            .slice(0, 8)
            .map((e) => e.destination),
        ),
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
    const searchParams = new URLSearchParams(window.location.search);

    const departure = searchParams.get('departure');
    const destination = searchParams.get('destination');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');

    if (departure) {
      setSearch(departure);
      setSelectedCity(departure);
    }
    if (destination) {
      setSearchWhere(destination);
      setSelectedWhere(destination);
    }
    if (dateFrom) setFromDate(new Date(dateFrom));
    if (dateTo) setToDate(new Date(dateTo));
    if (adultsParam) setAdults(parseInt(adultsParam));
    if (childrenParam) setChildren(parseInt(childrenParam));

    if (dateFrom && dateTo) {
      setRange({ from: new Date(dateFrom), to: new Date(dateTo) });
      setSelectData(
        `${formatDate.format(new Date(dateFrom), 'DD/MM/YYYY')} - ${formatDate.format(new Date(dateTo), 'DD/MM/YYYY')}`,
      );
    }
  }, []);

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
    <div className="mt-10 bg-white shadow-sm py-4 gap-4 w-full rounded-3xl grid grid-cols-5 items-center px-10 max-lg:hidden font-medium">
      <div className="relative gap-2 h-full ">
        <div
          onClick={() => setOpenCity(!openCity)}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md text-[#121212]">
            {t('Откуда')}
          </Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md placeholder:text-[#A3A3A3]"
              placeholder={t('Откуда')}
              value={search || selectedCity}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedCity(e.target.value);
              }}
            />
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
          </div>
        </div>

        {openCity && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenCity(false)}
            />
            <ArrowDropUpOutlinedIcon
              sx={{
                position: 'absolute',
                top: '85px',
                zIndex: 40,
                fontSize: '32px',
                color: 'white',
              }}
            />
            <div
              className="absolute top-[105px] border shadow-2xl rounded-2xl bg-white w-60 z-40 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative mb-2">
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#909091]" />
                <Input
                  placeholder={t('Укажите город')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 text-[#212122] placeholder:text-[#909091]"
                />
              </div>
              {filteredCities.length > 0 ? (
                filteredCities.map((cityName) => (
                  <div
                    key={cityName}
                    className="p-2 hover:bg-gray-200 rounded-lg text-[#212122] items-center cursor-pointer flex justify-between"
                    onClick={() => {
                      setSelectedCity(cityName);
                      setSearch(cityName);
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
                <div className="p-2 text-[#212122] text-center">
                  {t('Не найдено')}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="relative gap-2 h-full ">
        <div
          onClick={() => setWhere(!where)}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md text-[#121212]">
            {t('Куда')}
          </Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md placeholder:text-[#A3A3A3]"
              placeholder={t('Страна, курорт')}
              value={searchWhere || selectedWhere}
              onChange={(e) => {
                setSearchWhere(e.target.value);
                setSelectedWhere(e.target.value);
              }}
            />
            <AirplanemodeActiveIcon
              sx={{
                position: 'absolute',
                color: '#212122',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {where && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setWhere(false)}
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
              className="absolute top-[105px] border shadow-2xl rounded-2xl bg-white w-60 z-40 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative mb-2">
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#909091]" />
                <Input
                  placeholder={t('Укажите город')}
                  value={searchWhere}
                  onChange={(e) => setSearchWhere(e.target.value)}
                  className="w-full pl-10 text-[#212122] placeholder:text-[#909091]"
                />
              </div>
              {filteredCitiesWhere.length > 0 ? (
                filteredCitiesWhere.map((cityName) => (
                  <div
                    key={cityName}
                    className="p-2 hover:bg-gray-200 rounded-lg text-[#212122] items-center cursor-pointer flex justify-between"
                    onClick={() => {
                      setSelectedWhere(cityName);
                      setSearchWhere(cityName);
                      setWhere(false);
                    }}
                  >
                    {cityName}
                    {cityName === selectedWhere && (
                      <DoneIcon sx={{ width: '14px', height: '14px' }} />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-2 text-[#212122] text-center">
                  {t('Не найдено')}
                </div>
              )}
            </div>
          </>
        )}
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
              className="h-[60px] text-md placeholder:text-[#A3A3A3]"
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
              className="h-[60px] text-md placeholder:text-md placeholder:text-[#A3A3A3]"
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

      <div className="flex flex-col gap-2">
        <div className="h-[25px]" />
        <Button
          className="bg-[#1764FC] cursor-pointer hover:bg-[#1764FC] text-lg text-white h-[60px] flex items-center justify-center rounded-4xl font-semibold"
          onClick={saveFilter}
        >
          <p>{t('Искать туры')}</p>
        </Button>
      </div>
    </div>
  );
};

export default FilterTours;
