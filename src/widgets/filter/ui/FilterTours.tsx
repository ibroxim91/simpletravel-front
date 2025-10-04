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

import { useRouter } from '@/shared/config/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useFilterToursStore } from '../lib/store';

const FilterTours = () => {
  const t = useTranslations();
  const route = useRouter();
  const {
    setStoreDate,
    from,
    date,
    setStoreToDate,
    toDate: toDateStore,
    selectData: selectDataStore,
    setStoreSelectData,
    where: wherStore,
    adults: adultsStore,
    children: childrenStore,
    setAdults: setAdultsStore,
    setChildren: setChildrenStore,
    setStoreFrom,
    setStoreWhere,
    setStorePassenger,
  } = useFilterToursStore();
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
          ticket.data.results.tickets.slice(0, 8).map((e) => e.departure),
        ),
      );
      setCities(uniqueCities);
    }
  }, [ticket]);

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

  // const cities = ['Самарканд', 'Бухара', 'Наваи', 'Бишкек', 'Казан', 'Астана'];
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredCitiesWhere = citiesWhere.filter((c) =>
    c.toLowerCase().includes(searchWhere.toLowerCase()),
  );

  useEffect(() => {
    if (from) {
      setSearch(from);
      setSelectedCity(from);
    }
    if (wherStore) {
      setSearchWhere(wherStore);
      setSelectedWhere(wherStore);
    }
    if (date) {
      setFromDate(date);
    }
    if (toDateStore) {
      setToDate(toDateStore);
    }
    if (selectDataStore) {
      setSelectData(selectDataStore);
    }
    if (adultsStore) {
      setAdults(adultsStore);
    }

    if (childrenStore) {
      setChildren(childrenStore);
    }
    if (date && toDateStore) {
      setRange({ from: date, to: toDateStore });
      setFromDate(date);
      setToDate(toDateStore);
    }
  }, [
    from,
    wherStore,
    date,
    selectDataStore,
    toDateStore,
    childrenStore,
    adultsStore,
  ]);

  const saveFilter = () => {
    setStoreDate(fromDate);
    setStoreFrom(search);
    setStoreToDate(toDate);
    setStoreWhere(searchWhere);
    setStoreSelectData(selectData);
    setStorePassenger(adults + children);
    setAdultsStore(adults);
    setChildrenStore(children);
    route.push('/selectour');
  };

  return (
    <div className="mt-10 bg-white shadow-sm py-4 gap-4 w-full rounded-3xl grid grid-cols-5 items-center px-10 max-lg:hidden font-medium">
      <div className="relative gap-2 h-full ">
        <div
          onClick={() => {
            setOpenCity(!openCity);
            setSearch('');
          }}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md ">{t('Откуда')}</Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md"
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
                color: 'black',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {openCity && (
          <div
            className="fixed inset-0 z-40 "
            onClick={() => setOpenCity(false)}
          />
        )}

        {openCity && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              top: '85px',
              zIndex: 60,
              fontSize: '32px',
              color: 'white',
              filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0.3))',
              left: '10px',
            }}
          />
        )}

        {openCity && (
          <div
            className="absolute top-[105px] border border-white shadow-2xl rounded-2xl bg-white w-60 z-50 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-2">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t('Укажите город')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 text-black"
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
            </div>

            {filteredCities.length > 0 ? (
              filteredCities.map((cityName) => (
                <div
                  key={cityName}
                  className="p-2 hover:bg-gray-200 rounded-lg text-black items-center cursor-pointer flex justify-between"
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
              <div className="p-2 text-black">{t('Не найдено')}</div>
            )}
          </div>
        )}
      </div>

      <div className="relative gap-2 h-full ">
        <div
          onClick={() => {
            setWhere(!where);
            setSearchWhere('');
          }}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md ">{t('Куда')}</Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md"
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
                color: 'black',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {where && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              top: '85px',
              zIndex: 60,
              fontSize: '32px',
              color: 'white',
              filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0.3))',
              left: '10px',
            }}
          />
        )}

        {where && (
          <div
            className="fixed inset-0 z-40 "
            onClick={() => setWhere(false)}
          />
        )}

        {where && (
          <div
            className="absolute top-[105px] border border-white shadow-2xl rounded-2xl bg-white w-60 z-50 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-2">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t('Укажите город')}
                value={searchWhere}
                onChange={(e) => setSearchWhere(e.target.value)}
                className="w-full pl-10 text-black"
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
            </div>

            {filteredCitiesWhere.length > 0 ? (
              filteredCitiesWhere.map((cityName) => (
                <div
                  key={cityName}
                  className="p-2 hover:bg-gray-200 rounded-lg text-black items-center cursor-pointer flex justify-between"
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
              <div className="p-2 text-black">{t('Не найдено')}</div>
            )}
          </div>
        )}
      </div>

      <div className="relative gap-2 h-full ">
        <div
          onClick={() => {
            setDataOpen(!dataOpen);
          }}
          className="cursor-pointer flex flex-col gap-2"
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

        {dataOpen && (
          <div
            className="fixed inset-0 z-40 "
            onClick={() => setDataOpen(false)}
          />
        )}

        {dataOpen && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              top: '85px',
              zIndex: 60,
              fontSize: '32px',
              color: 'white',
              filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0.3))',
              left: '10px',
            }}
          />
        )}

        {dataOpen && (
          <div
            className="absolute top-[105px] border border-white shadow-2xl rounded-2xl bg-white z-50 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 items-center">
              <Input
                placeholder={t('Когда')}
                value={
                  fromDate ? formatDate.format(fromDate, 'DD/MM/YYYY') : ''
                }
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-black h-[50px]"
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
              <ArrowRightAltIcon
                color="action"
                sx={{ width: '28px', height: '28px' }}
              />
              <Input
                placeholder={t('Выезд')}
                value={toDate ? formatDate.format(toDate, 'DD/MM/YYYY') : ''}
                disabled={fromDate === undefined}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-black h-[50px]"
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex gap-2 border-t-2 p-2 border-b-2 mt-5 border-t-secondary">
              <Calendar
                mode="range"
                selected={range}
                onSelect={(val) => {
                  setRange(val);
                  setFromDate(val?.from);
                  setToDate(val?.to);
                }}
                showOutsideDays={false}
                numberOfMonths={2}
              />
            </div>
            <div className="grid grid-cols-2 mt-5 gap-2">
              <button
                className="bg-blue-500/40 rounded-3xl p-3 text-blue-600 cursor-pointer"
                onClick={() => {
                  setDataOpen(false);
                  setFromDate(undefined);
                  setToDate(undefined);
                  setRange(undefined);
                  setStoreDate(undefined);
                  setSelectData('');
                  setStoreSelectData('');
                  setStoreToDate(undefined);
                }}
              >
                {t('Отмена')}
              </button>
              <button
                className="bg-blue-600 rounded-3xl text-white"
                onClick={() => {
                  setDataOpen(false);
                  if (fromDate && toDate) {
                    setSelectData(
                      `${formatDate.format(fromDate, 'DD/MM/YYYY') + ' - ' + formatDate.format(toDate, 'DD/MM/YYYY')}`,
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
        )}
      </div>

      <div className="relative gap-2 h-full ">
        <div
          onClick={() => {
            setAgeOpen(!ageOpen);
          }}
          className="cursor-pointer flex flex-col gap-2"
        >
          <Label className="font-semibold text-md">{t('Туристы')}</Label>
          <div className="relative">
            <Input
              className="h-[60px] text-md placeholder:text-md"
              placeholder={t('Туристы')}
              value={selectAge === 0 ? '' : selectAge}
              readOnly
            />
          </div>
        </div>

        {ageOpen && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              top: '85px',
              zIndex: 60,
              fontSize: '32px',
              color: 'white',
              filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0.3))',
              left: '10px',
            }}
          />
        )}

        {ageOpen && (
          <div
            className="fixed inset-0 z-40 "
            onClick={() => setAgeOpen(false)}
          />
        )}

        {ageOpen && (
          <div
            className="absolute top-[105px] border border-white shadow-2xl rounded-2xl bg-white z-50 p-2 px-4 w-96 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <Label className="flex flex-col gap-0 items-start">
                <p className="font-semibold text-lg">{t('Вызрослых')}</p>
                <p className="text-ring text-sm">{t('старше 13 лет')}</p>
              </Label>
              <div className="grid grid-cols-3 border justify-center items-center rounded-lg w-48">
                <Button
                  variant={'ghost'}
                  className="h-full rounded-bl-lg rounded-br-none rounded-tr-none"
                  onClick={() => {
                    setAdults((prev) => (prev > 0 ? prev - 1 : prev));
                  }}
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
                  onClick={() => {
                    setAdults((prev) => prev + 1);
                  }}
                >
                  <AddIcon className="text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-5">
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
                  onClick={() => {
                    setChildren((prev) => prev + 1);
                  }}
                >
                  <AddIcon className="text-blue-600" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-[25px]" />
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

export default FilterTours;
