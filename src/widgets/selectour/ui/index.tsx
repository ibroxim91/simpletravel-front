'use client';

import loaderAnimation from '@/assets/lottie/Travel Tour.json';
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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import qs from 'qs';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import Ticket_Api from '../lib/api';
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
  const [priceRange, setPriceRange] = useState<number[]>([2500000, 100000000]);
  const {
    destinations,
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
    setCurrentPage(1);
  }, [
    savedData,
    cheaper,
    expensive,
    hotelType,
    hotelName,
    priceRange,
    visa,
    selectedDurations,
    selectedDestinations,
    mealPlan,
    hotelAmenities,
    hotelRating,
    hotelFeature,
  ]);

  useEffect(() => {
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFilterLocal(parsed);
      setSelectedDestinations(parsed.where);
    }
  }, [savedData]);

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
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (ticket && !initialized.current) {
      setDurationDays(ticket.data.results.top_duration);
      setDestinations(ticket.data.results.top_destinations);
      setHotelType(ticket.data.results.hotel_types);
      setHotelAmenities(ticket.data.results.hotel_amenities);
      setFeatures(ticket.data.results.hotel_features_by_type);
      initialized.current = true;
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
    router.push(`selectour?page=${currentPage}`);
  }, [currentPage, router]);

  useEffect(() => {
    if (searchParams.get('page')) {
      setCurrentPage(Number(searchParams.get('page')));
    }
  }, [searchParams]);

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
          <h2 className="text-lg font-semibold">{t('Фильтры')}</h2>
          <hr className="my-3 border-[#DFDFDF]" />

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
              exclusive
            />
            <CheckboxFilter
              value="visa"
              label={t('С визой')}
              selectedValue={visa}
              setChecked={setVisa}
              exclusive
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
                    exclusive
                  />
                ))}
          </FilterSection>

          <FilterSection title={t('Регионы и курорты')}>
            {destinations &&
              destinations.map((e) => (
                <CheckboxFilter
                  key={e.destination}
                  value={e.destination}
                  label={e.destination}
                  setChecked={setSelectedDestinations}
                  selectedValue={selectedDestinations}
                  exclusive
                />
              ))}
          </FilterSection>

          <FilterSection title={t('Категория отеля')}>
            <CheckboxFilter
              value="5.0"
              label={t('5 звезды')}
              setChecked={setHotelRating}
              selectedValue={hotelRating}
              exclusive
            />
            <CheckboxFilter
              value="4.0"
              label={t('4 звезды')}
              setChecked={setHotelRating}
              selectedValue={hotelRating}
              exclusive
            />
            <CheckboxFilter
              value="3.0"
              label={t('3 звезды')}
              setChecked={setHotelRating}
              selectedValue={hotelRating}
              exclusive
            />
          </FilterSection>

          <FilterSection title={t('Питание')}>
            <CheckboxFilter
              value="Full"
              label={t('Все включено')}
              setChecked={setMealPlan}
              selectedValue={mealPlan}
              exclusive
            />
            <CheckboxFilter
              value="Breakfast"
              label={t('Завтрак')}
              setChecked={setMealPlan}
              selectedValue={mealPlan}
              exclusive
            />
            <CheckboxFilter
              value="Half"
              label={t('Полупансион')}
              setChecked={setMealPlan}
              selectedValue={mealPlan}
              exclusive
            />
          </FilterSection>

          <FilterSection title={t('Тип отеля')}>
            {hotel_type &&
              hotel_type.map((e) => (
                <CheckboxFilter
                  key={e}
                  value={e}
                  label={e}
                  setChecked={setHotelTypes}
                  selectedValue={hotelType}
                  exclusive
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
                    label={feature}
                    setChecked={setHotelFeature}
                    selectedValue={hotelFeature}
                    exclusive
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
                  setChecked={setHotelAmenitie}
                  selectedValue={hotelAmenities}
                  exclusive
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
            <p className="font-semibold text-lg">{t('Филтры')}</p>
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
              <h2 className="text-lg font-semibold">{t('Фильтры')}</h2>
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
                exclusive
              />
              <CheckboxFilter
                value="visa"
                label={t('С визой')}
                selectedValue={visa}
                setChecked={setVisa}
                exclusive
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
                      exclusive
                    />
                  ))}
            </FilterSection>

            <FilterSection title={t('Регионы и курорты')}>
              {destinations &&
                destinations.map((e) => (
                  <CheckboxFilter
                    key={e.destination}
                    value={e.destination}
                    label={e.destination}
                    setChecked={setSelectedDestinations}
                    selectedValue={selectedDestinations}
                    exclusive
                  />
                ))}
            </FilterSection>

            <FilterSection title={t('Категория отеля')}>
              <CheckboxFilter
                value="5.0"
                label={t('5 звезды')}
                setChecked={setHotelRating}
                selectedValue={hotelRating}
                exclusive
              />
              <CheckboxFilter
                value="4.0"
                label={t('4 звезды')}
                setChecked={setHotelRating}
                selectedValue={hotelRating}
                exclusive
              />
              <CheckboxFilter
                value="3.0"
                label={t('3 звезды')}
                setChecked={setHotelRating}
                selectedValue={hotelRating}
                exclusive
              />
            </FilterSection>

            <FilterSection title={t('Питание')}>
              <CheckboxFilter
                value="Full"
                label={t('Все включено')}
                setChecked={setMealPlan}
                selectedValue={mealPlan}
                exclusive
              />
              <CheckboxFilter
                value="Breakfast"
                label={t('Завтрак')}
                setChecked={setMealPlan}
                selectedValue={mealPlan}
                exclusive
              />
              <CheckboxFilter
                value="Half"
                label={t('Полупансион')}
                setChecked={setMealPlan}
                selectedValue={mealPlan}
                exclusive
              />
            </FilterSection>

            <FilterSection title={t('Тип отеля')}>
              {hotel_type &&
                hotel_type.map((e) => (
                  <CheckboxFilter
                    value={e}
                    key={e}
                    label={e}
                    setChecked={setHotelTypes}
                    selectedValue={hotelType}
                    exclusive
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
                      label={feature}
                      setChecked={setHotelFeature}
                      selectedValue={hotelFeature}
                      exclusive
                    />
                  ))}
              </FilterSection>
            ))}

            <FilterSection title={t('Дополнительно')}>
              {hotel_amenities &&
                hotel_amenities.map((e) => (
                  <CheckboxFilter
                    value={e}
                    key={e}
                    label={e}
                    setChecked={setHotelAmenitie}
                    selectedValue={hotelAmenities}
                    exclusive
                  />
                ))}
            </FilterSection>
            <div className="sticky bottom-0 w-full left-0">
              <button
                className="bg-blue-600 rounded-3xl p-3 w-full text-white cursor-pointer font-semibold"
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
                <h1 className="font-bold text-2xl text-start">
                  {filterLocal?.where
                    ? ` ${filterLocal?.where}${t('ga tegishli')}`
                    : t('Umumiy')}{' '}
                  {ticket ? (
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
                  <p className="text-xl font-semibold mt-3 text-gray-700">
                    {t('Загрузка')}
                  </p>
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
                      className="flex flex-col justify-center items-center mt-10"
                    >
                      <Player
                        autoplay
                        loop
                        src={loaderAnimation}
                        style={{ height: '240px', width: '240px' }}
                      />
                      <p className="text-2xl font-semibold">
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
