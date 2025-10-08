import { useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import Ticket_Api from '@/widgets/selectour/lib/api';
import AddIcon from '@mui/icons-material/Add';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useFilterToursStore } from '../lib/store';

const FilterHotelMobile = () => {
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
  const [ageOpen, setAgeOpen] = useState(false);
  const [dataOpenMobile, setDataOpenMobile] = useState(false);
  const [whereMobile, setWhereMobile] = useState(false);
  const [selectAge, setSelectAge] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [selectedWhere, setSelectedWhere] = useState('');
  const [searchWhere, setSearchWhere] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectData, setSelectData] = useState<string>('');
  const [adults, setAdults] = useState<number>(0);
  const [range, setRange] = useState<DateRange | undefined>();
  const [children, setChildren] = useState<number>(0);
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
          ticket.data.results.tickets.slice(0, 8).map((e) => e.destination),
        ),
      );
      setCitiesWhere(uniqueCities);
    }
  }, [ticket]);

  const filteredCitiesWhere = citiesWhere.filter((c) =>
    c.toLowerCase().includes(searchWhere.toLowerCase()),
  );

  useEffect(() => {
    if (from) {
      setSearch(from);
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

    if (adultsStore && childrenStore) {
      setSelectAge(adultsStore + childrenStore);
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
    <div className="mt-20 bg-white shadow-sm py-4 gap-4 w-full rounded-3xl grid grid-cols-1 items-center px-10 min-lg:hidden font-medium">
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
        <Drawer
          anchor="bottom"
          className=""
          onClose={() => {
            setDataOpenMobile(false);
            setFromDate(undefined);
            setToDate(undefined);
          }}
          open={dataOpenMobile}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 2,
              width: '100%',
              overflow: 'auto',
              height: '50%',
            },
          }}
        >
          <div className="flex flex-col gap-4 w-full font-medium">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{t('Дата отправления')}</p>
              <Button
                variant={'outline'}
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                onClick={() => setDataOpenMobile(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>
            <div className="flex flex-row gap-2">
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
                className="self-center mx-2"
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
            <div className="grid grid-cols-1 mt-4">
              <Calendar
                className="w-full max-w-2xl mx-auto"
                mode="range"
                selected={range}
                onSelect={(val) => {
                  setRange(val);
                  setFromDate(val?.from);
                  setToDate(val?.to);
                }}
                showOutsideDays={false}
              />
              {/* <Calendar
                    mode="single"
                    className="w-full max-sm:hidden"
                    selected={fromDate}
                    onSelect={setFromDate}
                    disabled={(date: Date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                  <Calendar
                    mode="single"
                    className="w-full max-sm:hidden"
                    selected={toDate}
                    onSelect={setToDate}
                    disabled={(date: Date) => {
                      if (!fromDate) return true;
                      return date <= fromDate;
                    }}
                  /> */}
              {/* {!fromDate && (
                    <Calendar
                      mode="single"
                      className="w-full h-auto min-sm:hidden"
                      selected={fromDate}
                      onSelect={setFromDate}
                      disabled={(date: Date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  )}
                  {fromDate && (
                    <Calendar
                      mode="single"
                      className="w-full min-sm:hidden"
                      selected={toDate}
                      onSelect={setToDate}
                      disabled={(date: Date) => {
                        if (!fromDate) return true;
                        return date <= fromDate;
                      }}
                    />
                  )} */}
            </div>
            <div className="grid grid-cols-2 mt-0 gap-2">
              <button
                className="bg-blue-500/40 rounded-3xl p-3 text-blue-600 cursor-pointer"
                onClick={() => {
                  setDataOpenMobile(false);
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
                  setDataOpenMobile(false);
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
        </Drawer>
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

export default FilterHotelMobile;
