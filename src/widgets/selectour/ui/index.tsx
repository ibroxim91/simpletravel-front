'use client';

import loaderAnimation from '@/assets/lottie/Loading spinner simplui.json';
import { country_api } from '@/shared/config/api/country';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/shared/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import FilterTours from '@/widgets/filter/ui/FilterTours';
import FilterToursMobile from '@/widgets/filter/ui/FilterToursMobile';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import qs from 'qs';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import Ticket_Api, { hotel_meal_plan } from '../lib/api';
import { useFilterTickectsStore } from '../lib/store';
import { TickectAllFilter } from '../lib/types';
import CheckboxFilter from './CheckBox';
import FilterSection from './FilterSection';
import TourItem from './TourItem';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false },
);

export default function Selectour() {
  const t = useTranslations();
  const [priceRange, setPriceRange] = useState<number[] | []>([]);
  const {
    durationDays,
    setDestinations,
    setDurationDays,
    setHotelType,
    hotel_amenities,
    setHotelAmenities,
    setFeatures,
    hotel_features_by_type,
    hotel_type,
  } = useFilterTickectsStore();
  const [hotelName, setHotelName] = useState<string>('');
  const [expensive, setExpensive] = useState<boolean>(false);
  const [cheaper, setCheaper] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visa, setVisa] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterLocal, setFilterLocal] = useState<{
    adults: number;
    children: number;
    from: string;
    date: string;
    toDate: string;
    selectData: string;
    where: string;
  }>();
  const [selectedDurations, setSelectedDurations] = useState<string | null>(
    null,
  );
  const [selectedDestinations, setSelectedDestinations] = useState<
    string | null
  >(null);
  const [hotelRating, setHotelRating] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [hotelType, setHotelTypes] = useState<string | null>(null);
  const [hotelAmenities, setHotelAmenitie] = useState<string | null>(null);
  const [hotelFeature, setHotelFeature] = useState<string[]>([]);
  const [openFilter, setFilter] = useState(false);
  const savedData = localStorage.getItem('filterTours');

  const handleInputChange = (value: string, index: number) => {
    const numericValue = Number(value.replace(/\s/g, '')) || 0;
    const newRange = [...priceRange];
    newRange[index] = numericValue;
    setPriceRange(newRange);
  };

  useEffect(() => {
    const departure = searchParams.get('departure') || '';
    const destination = searchParams.get('destination') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const adultsParam = searchParams.get('adults') || '0';
    const childrenParam = searchParams.get('children') || '0';

    const filterData = {
      from: departure,
      where: destination,
      date: dateFrom,
      toDate: dateTo,
      selectData:
        dateFrom && dateTo
          ? `${formatDate.format(new Date(dateFrom), 'DD/MM/YYYY')} - ${formatDate.format(new Date(dateTo), 'DD/MM/YYYY')}`
          : '',
      adults: parseInt(adultsParam),
      children: parseInt(childrenParam),
    };
    setFilterLocal(filterData);
    setSelectedDestinations(destination);
  }, [searchParams]);

  const { data: country } = useQuery({
    queryKey: ['country_list'],
    queryFn: () => country_api.list(),
    select(data) {
      return data.data.data;
    },
  });

  const { data: meal } = useQuery({
    queryKey: ['meal_list'],
    queryFn: () => hotel_meal_plan(),
    select(data) {
      return data.data.data;
    },
  });

  const { data: ticket, isLoading } = useQuery({
    queryKey: [
      'ticket_all',
      savedData,
      selectedDestinations,
      cheaper,
      expensive,
      filterLocal,
      currentPage,
      hotelType,
      hotelName,
      priceRange,
      visa,
      selectedDurations,
      mealPlan,
      hotelAmenities,
      hotelRating,
      hotelFeature,
    ],
    queryFn: () => {
      const params: TickectAllFilter = {
        page: currentPage,
        page_size: 10,
        adults: filterLocal?.adults,
        children: filterLocal?.children,
        departure: filterLocal ? filterLocal.from : '',
        destination: selectedDestinations === null ? '' : selectedDestinations,
        hotel_amenity: hotelAmenities ?? '',
        hotel_name: hotelName,
        hotel_type: hotelType ?? '',
        cheapest: cheaper,
        most_expensive: expensive,
        min_departure_date: filterLocal?.date
          ? formatDate.format(filterLocal?.date, 'YYYY-MM-DD')
          : '',
        max_departure_date: filterLocal?.toDate
          ? formatDate.format(filterLocal.toDate, 'YYYY-MM-DD')
          : '',
        passenger_count: filterLocal
          ? filterLocal?.children + filterLocal?.adults
          : undefined,
        min_price: priceRange[0],
        max_price: priceRange[1],
        visa_required: visa === 'visa' ? true : visa === 'no_visa' ? false : '',
        hotel_rating: hotelRating ?? '',
        duration_days: selectedDurations ?? '',
        meal_plan: mealPlan ?? '',
        hotel_feature: hotelFeature,
      };

      return Ticket_Api.GetAllTickets({
        params,
        paramsSerializer: (params: TickectAllFilter) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      });
    },
    staleTime: 0,
  cacheTime: 0,
    enabled: !!filterLocal || !!selectedDestinations,
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (ticket ) {
      setDurationDays(ticket.data.results.top_duration);
      setDestinations(ticket.data.results.top_destinations);
      setHotelType(ticket.data.results.hotel_types);
      setHotelAmenities(ticket.data.results.hotel_amenities);
      setFeatures(ticket.data.results.hotel_features_by_type);
      // initialized.current = true;
    }
  }, [
    ticket,
    setDurationDays,
    setDestinations,
    setHotelType,
    setHotelAmenities,
    setFeatures,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', currentPage.toString());

    router.replace(`/selectour?${params.toString()}`);
  }, [currentPage, router, searchParams]);

  useEffect(() => {
    if (searchParams.get('page')) {
      setCurrentPage(Number(searchParams.get('page')));
    }
  }, [searchParams]);

  const regionId = Number(filterLocal?.where);
  const regionData = country?.find((c) =>
    c.regions.some((r) => r.id === regionId),
  );

  const regionName = regionData?.regions.find((r) => r.id === regionId)?.name;
  const countryName = regionData?.name;

  return (
    <div className="custom-container mt-5 bg-[#edeef1] min-h-screen pb-20">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 2,
          },
        }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          {t('Главная')}
        </Link>
        <p className="text-[#646465] font-medium">{t('Подобрать тур')}</p>
      </Breadcrumbs>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: 'easeOut',
        }}
      >
        <FilterTours />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: 'easeOut',
        }}
      >
        <FilterToursMobile />
      </motion.div>

      <div className="mt-10 flex gap-10 max-lg:flex-col">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="w-[40%] p-5 rounded-2xl bg-white h-max max-lg:hidden"
        >
          <h2 className="text-lg font-semibold text-[#212122]">
            {t('Фильтры')}
          </h2>
          <hr className="my-3 border-[#DFDFDF]" />

          <FilterSection title={t('Стоимость')}>
            <Slider
              range
              min={2500000}
              max={100000000}
              value={priceRange}
              className="placeholder:!text-[#909091] !text-[#909091]"
              onChange={(v) => {
                setPriceRange(v as number[]);
                setCurrentPage(1);
              }}
            />
            <div className="flex justify-between mt-3 border border-[#DFDFDF] rounded-xl p-3">
              <input
                type="text"
                value={formatPrice(priceRange[0])}
                placeholder="2 500 000"
                onChange={(e) => {
                  handleInputChange(e.target.value, 0);
                  setCurrentPage(1);
                }}
                className={clsx(
                  'w-1/2 border-none outline-none',
                  priceRange[0] ? 'text-[#212122]' : 'text-[#909091]',
                )}
              />
              <input
                type="text"
                value={formatPrice(priceRange[1])}
                onChange={(e) => {
                  handleInputChange(e.target.value, 1);
                  setCurrentPage(1);
                }}
                className={clsx(
                  'w-1/2 border-none outline-none text-right',
                  priceRange[1] ? 'text-[#212122]' : 'text-[#909091]',
                )}
              />
            </div>
          </FilterSection>

          <FilterSection title={t('Название отеля')}>
            <div className="relative">
              <input
                type="text"
                placeholder={t('Название отеля')}
                onChange={(e) => {
                  setHotelName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border rounded-xl px-10 py-2 outline-none placeholder:text-[#909091] text-[#212122]"
              />
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#909091]" />
            </div>
          </FilterSection>

          <FilterSection title={t('Условия въезда')}>
            <CheckboxFilter
              value="no_visa"
              label={t('Без визы')}
              selectedValue={visa}
              setChecked={setVisa}
              onclick={setCurrentPage}
              exclusive
              paramName="visa"
            />
            <CheckboxFilter
              value="visa"
              label={t('С визой')}
              selectedValue={visa}
              setChecked={setVisa}
              onclick={setCurrentPage}
              exclusive
              paramName="visa"
            />
          </FilterSection>

          <FilterSection title={t('Продолжительность тура')}>
            {durationDays &&
              [...durationDays]
                .sort((a, b) => a.duration - b.duration)
                .map((e) => (
                  <CheckboxFilter
                    key={e.duration}
                    value={String(e.duration)}
                    label={`${e.duration} ${t('дня')}`}
                    setChecked={setSelectedDurations}
                    selectedValue={selectedDurations}
                    onclick={setCurrentPage}
                    exclusive
                    paramName="duration"
                  />
                ))}
          </FilterSection>

          <FilterSection title={t('Регионы и курорты')}>
            {country &&
              country.map((e) => (
                <>
                  {e.regions.map((r) => (
                    <CheckboxFilter
                      key={r.id}
                      value={String(r.id)}
                      label={r.name}
                      setChecked={setSelectedDestinations}
                      selectedValue={selectedDestinations}
                      exclusive
                      paramName="destination"
                    />
                  ))}
                </>
              ))}
          </FilterSection>

          <FilterSection title={t('Категория отеля')}>
            <CheckboxFilter
              value="5.0"
              label={t('5 звезды')}
              setChecked={setHotelRating}
              selectedValue={hotelRating}
              onclick={setCurrentPage}
              exclusive
              paramName="rating"
            />
            <CheckboxFilter
              value="4.0"
              label={t('4 звезды')}
              setChecked={setHotelRating}
              selectedValue={hotelRating}
              onclick={setCurrentPage}
              exclusive
              paramName="rating"
            />
            <CheckboxFilter
              value="3.0"
              label={t('3 звезды')}
              onclick={setCurrentPage}
              setChecked={setHotelRating}
              selectedValue={hotelRating}
              exclusive
              paramName="rating"
            />
          </FilterSection>

          <FilterSection title={t('Питание')}>
            {meal?.map((e) => (
              <CheckboxFilter
                value={String(e.id)}
                label={e.name}
                key={e.id}
                onclick={setCurrentPage}
                setChecked={setMealPlan}
                selectedValue={mealPlan}
                exclusive
                paramName="meal"
              />
            ))}
          </FilterSection>

          <FilterSection title={t('Тип отеля')}>
            {hotel_type &&
              hotel_type.map((e) => (
                <CheckboxFilter
                  key={e}
                  value={e}
                  label={e}
                  onclick={setCurrentPage}
                  setChecked={setHotelTypes}
                  selectedValue={hotelType}
                  exclusive
                  paramName="type-hotel"
                />
              ))}
          </FilterSection>

          {hotel_features_by_type.map((row) => (
            <FilterSection key={row.type} title={row.type}>
              {row.features &&
                row.features.length > 0 &&
                row.features.map((feature, i) => (
                  <CheckboxFilter
                    key={i}
                    value={feature}
                    onclick={setCurrentPage}
                    label={feature}
                    setChecked={setHotelFeature}
                    selectedValue={hotelFeature}
                    exclusive
                    paramName="feature"
                  />
                ))}
            </FilterSection>
          ))}

          <FilterSection title={t('Дополнительно')}>
            {hotel_amenities &&
              hotel_amenities.map((e) => (
                <CheckboxFilter
                  key={e}
                  value={e}
                  label={e}
                  onclick={setCurrentPage}
                  setChecked={setHotelAmenitie}
                  selectedValue={hotelAmenities}
                  exclusive
                  paramName="amenitie"
                />
              ))}
          </FilterSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="lg:hidden"
        >
          <div
            className="bg-white shadow-sm flex items-center justify-between px-4 py-4 rounded-xl"
            onClick={() => setFilter(true)}
          >
            <p className="font-semibold text-lg text-[#212122]">
              {t('Филтры')}
            </p>
            <FilterListIcon />
          </div>
          <Drawer
            anchor="bottom"
            open={openFilter}
            onClose={() => setFilter(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 2,
                width: '100%',
                overflow: 'auto',
                maxHeight: '70%',
              },
            }}
          >
            <div className="mb-5 flex items-center justify-between sticky">
              <h2 className="text-lg font-semibold text-[#121212]">
                {t('Фильтры')}
              </h2>
              <Button
                variant={'outline'}
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                onClick={() => setFilter(false)}
              >
                <CloseIcon sx={{ color: 'black' }} />
              </Button>
            </div>

            <FilterSection title={t('Стоимость')}>
              <Slider
                range
                min={2500000}
                max={100000000}
                value={priceRange}
                onChange={(v) => setPriceRange(v as number[])}
              />
              <div className="flex justify-between mt-3 border border-[#DFDFDF] rounded-xl p-3">
                <input
                  type="text"
                  value={formatPrice(priceRange[0])}
                  onChange={(e) => handleInputChange(e.target.value, 0)}
                  className="w-1/2 border-none outline-none text-gray-600"
                />
                <input
                  type="text"
                  value={formatPrice(priceRange[1])}
                  onChange={(e) => handleInputChange(e.target.value, 1)}
                  className="w-1/2 border-none outline-none text-right text-gray-600"
                />
              </div>
            </FilterSection>

            <FilterSection title={t('Название отеля')}>
              <input
                type="text"
                placeholder={t('Название отеля')}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 outline-none"
              />
            </FilterSection>

            <FilterSection title={t('Условия въезда')}>
              <CheckboxFilter
                value="no_visa"
                label={t('Без визы')}
                selectedValue={visa}
                setChecked={setVisa}
                onclick={setCurrentPage}
                exclusive
                paramName="visa"
              />
              <CheckboxFilter
                value="visa"
                label={t('С визой')}
                selectedValue={visa}
                setChecked={setVisa}
                onclick={setCurrentPage}
                exclusive
                paramName="visa"
              />
            </FilterSection>

            <FilterSection title={t('Продолжительность тура')}>
              {durationDays &&
                [...durationDays]
                  .sort((a, b) => a.duration - b.duration)
                  .map((e) => (
                    <CheckboxFilter
                      key={e.duration}
                      value={String(e.duration)}
                      label={`${e.duration} ${t('дня')}`}
                      setChecked={setSelectedDurations}
                      selectedValue={selectedDurations}
                      onclick={setCurrentPage}
                      exclusive
                      paramName="duration"
                    />
                  ))}
            </FilterSection>

            <FilterSection title={t('Регионы и курорты')}>
              {country &&
                country.map((e) => (
                  <>
                    {e.regions.map((r) => (
                      <CheckboxFilter
                        key={r.id}
                        value={String(r.id)}
                        label={r.name}
                        setChecked={setSelectedDestinations}
                        selectedValue={selectedDestinations}
                        exclusive
                        paramName="destination"
                      />
                    ))}
                  </>
                ))}
            </FilterSection>

            <FilterSection title={t('Категория отеля')}>
              <CheckboxFilter
                value="5.0"
                label={t('5 звезды')}
                setChecked={setHotelRating}
                selectedValue={hotelRating}
                onclick={setCurrentPage}
                exclusive
                paramName="rating"
              />
              <CheckboxFilter
                value="4.0"
                label={t('4 звезды')}
                setChecked={setHotelRating}
                selectedValue={hotelRating}
                onclick={setCurrentPage}
                exclusive
                paramName="rating"
              />
              <CheckboxFilter
                value="3.0"
                label={t('3 звезды')}
                onclick={setCurrentPage}
                setChecked={setHotelRating}
                selectedValue={hotelRating}
                exclusive
                paramName="rating"
              />
            </FilterSection>

            <FilterSection title={t('Питание')}>
              {meal?.map((e) => (
                <CheckboxFilter
                  value={String(e.id)}
                  label={e.name}
                  onclick={setCurrentPage}
                  setChecked={setMealPlan}
                  selectedValue={mealPlan}
                  exclusive
                  paramName="meal"
                  key={e.id}
                />
              ))}
            </FilterSection>

            <FilterSection title={t('Тип отеля')}>
              {hotel_type &&
                hotel_type.map((e) => (
                  <CheckboxFilter
                    key={e}
                    value={e}
                    label={e}
                    onclick={setCurrentPage}
                    setChecked={setHotelTypes}
                    selectedValue={hotelType}
                    exclusive
                    paramName="type-hotel"
                  />
                ))}
            </FilterSection>

            {hotel_features_by_type.map((row) => (
              <FilterSection key={row.type} title={row.type}>
                {row.features &&
                  row.features.length > 0 &&
                  row.features.map((feature, i) => (
                    <CheckboxFilter
                      key={i}
                      value={feature}
                      onclick={setCurrentPage}
                      label={feature}
                      setChecked={setHotelFeature}
                      selectedValue={hotelFeature}
                      exclusive
                      paramName="feature"
                    />
                  ))}
              </FilterSection>
            ))}

            <FilterSection title={t('Дополнительно')}>
              {hotel_amenities &&
                hotel_amenities.map((e) => (
                  <CheckboxFilter
                    key={e}
                    value={e}
                    label={e}
                    onclick={setCurrentPage}
                    setChecked={setHotelAmenitie}
                    selectedValue={hotelAmenities}
                    exclusive
                    paramName="amenitie"
                  />
                ))}
            </FilterSection>
            <div className="sticky bottom-0 w-full left-0">
              <button
                className="bg-[#1764FC] rounded-3xl p-3 w-full text-white cursor-pointer font-semibold"
                onClick={() => {
                  setFilter(false);
                }}
              >
                {t('Применять')}
              </button>
            </div>
          </Drawer>
        </motion.div>

        <div className="w-[100%] flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: 'easeOut',
              }}
            >
              <div className="w-full flex justify-between items-center max-lg:flex-col max-lg:items-start max-lg:gap-5">
                <h1 className="font-bold text-2xl text-start flex items-center gap-1 max-md:text-lg max-sm:text-sm">
                  {regionName ? (
                    <>
                      <span>{countryName}</span>
                      <KeyboardArrowRightIcon />
                      <span>
                        {regionName} {t('ga tegishli')}
                      </span>
                    </>
                  ) : (
                    t('Filter uchun Kerakli davlat va shaharni tanlang')
                  )}{' '}
                  {ticket && (regionName || ticket.data.total_items > 0) ? (
                    <>
                      {ticket.data.total_items} {t('ta tur topildi')}
                    </>
                  ) : (
                    ''
                  )}
                </h1>

                <Select
                  onValueChange={(value) => {
                    if (value === 'cheaper') {
                      setCheaper(true);
                      setExpensive(false);
                    } else if (value === 'expensive') {
                      setCheaper(false);
                      setExpensive(true);
                    } else if (value === 'all') {
                      setCheaper(false);
                      setExpensive(false);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px] !h-[40px] flex items-center justify-between max-lg:w-full rounded-lg border border-[#DFDFDF] gap-4 bg-[#FFFFFF]">
                    <SelectValue placeholder={t('По возрастанию цены')} />
                    <KeyboardArrowDownIcon />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('Все')}</SelectItem>
                    <SelectItem value="cheaper">{t('Подешевле')}</SelectItem>
                    <SelectItem value="expensive">{t('Подороже')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <div className="mt-5">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center min-h-screen bg-[#edeef1]">
                  <Player
                    autoplay
                    loop
                    src={loaderAnimation}
                    style={{ height: '240px', width: '240px' }}
                  />
                  {/* <p className="text-xl font-semibold mt-3 text-gray-700">
                    {t('Загрузка')}
                  </p> */}
                </div>
              ) : (
                <>
                  {ticket && ticket.data.results.tickets.length > 0 ? (
                    ticket?.data.results.tickets.map((item) => (
                      <TourItem key={item.id} data={item} />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1,
                        ease: 'easeOut',
                      }}
                      viewport={{ once: false, amount: 0.1 }}
                      className="flex flex-col justify-center items-center h-screen mt-10"
                    >
                      <p className="text-2xl font-semibold text-[#121212]">
                        {t('Не найдено')}
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
          {ticket && ticket.data.total_pages > 1 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: 'easeOut',
              }}
              viewport={{ once: false, amount: 0.1 }}
              className="flex justify-end items-end w-full mt-10"
            >
              <Pagination className="flex justify-end">
                <PaginationContent>
                  <Button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className="bg-[#ECF2FF] rounded-full w-10 hover:bg-[#ECF2FF] h-10 shadow-sm flex justify-center items-center cursor-pointer"
                  >
                    <ChevronLeft color="#084FE3" />
                  </Button>

                  {Array.from({ length: ticket.data.total_pages }).map(
                    (_, i) => {
                      const page = i + 1;

                      if (
                        page === 1 ||
                        page === ticket.data.total_pages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              href={`/selectour?page=${page}`}
                              className={clsx(
                                'rounded-full w-10 h-10 flex items-center justify-center shadow-sm',
                                currentPage === page
                                  ? 'bg-[#084FE3] text-white'
                                  : 'bg-[#ECF2FF] text-[#084FE3]',
                              )}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return null;
                    },
                  )}

                  <Button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === ticket.data.total_pages}
                    className="bg-[#ECF2FF] rounded-full w-10 hover:bg-[#ECF2FF] h-10 shadow-sm flex justify-center items-center cursor-pointer"
                  >
                    <ChevronRight color="#084FE3" />
                  </Button>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
