'use client';

import loaderAnimation from '@/assets/lottie/Loading spinner simplui.json';
import { country_api } from '@/shared/config/api/country';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
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
import StarIcon from '@mui/icons-material/Star';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Drawer from '@mui/material/Drawer';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import {
  BadgeDollarSign,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  SearchIcon,
  Utensils,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { toast } from 'sonner';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import Ticket_Api, { hotel_meal_plan } from '../lib/api';
import { useFilterTickectsStore } from '../lib/store';
import { TickectAll, TickectAllFilter } from '../lib/types';
import CheckboxFilter from './CheckBox';
import FilterSection from './FilterSection';
import TourItem from '@/widgets/selectour/ui/TourItem';
import { useMemo } from "react";

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false },
);

type FilterLocalState = {
  adults: number;
  children: number;
  from: string;
  date: string;
  toDate: string;
  selectData: string;
  where: string;
  operator?: string;
  town?: string;
  hotel_id?: string;
  mealPlan?: string;
};

const isEqualState = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

export default function Selectour() {
  const { locale:any } = useParams();
  const prevRegionRef = useRef<string | null>(null);
const prevHotelsRef = useRef<any[] | null>(null);
  const t = useTranslations();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
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
  const [hotelID, setHotelID] = useState<string | null>(null);
  const [expensive, setExpensive] = useState<boolean>(false);
  const [cheaper, setCheaper] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visa, setVisa] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterLocal, setFilterLocal] = useState<FilterLocalState>();
  const [selectedDurations, setSelectedDurations] = useState<string | null>(null,);
  const [selectedTown, setSelectedTown] = useState<string | null>(null);

  const [selectedDestinations, setSelectedDestinations] = useState<string | null>(null);
  const [selectedDefaulDestination, setSelectedDefaulDestination] = useState<string | null>(null);
  const [hotelRating, setHotelRating] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [hotelType, setHotelTypes] = useState<string | null>(null);
  const [hotelAmenities, setHotelAmenitie] = useState<string | null>(null);
  const [hotelFeature, setHotelFeature] = useState<string[]>([]);
  const [openFilter, setFilter] = useState(false);


  const handleInputChange = (value: string, index: number) => {
    const numericValue = Number(value.replace(/\s/g, '')) || 0;
    const newRange = [...priceRange];
    newRange[index] = numericValue;
    setPriceRange(newRange);
  };



  useEffect(() => {
    const departure = searchParams.get('departure') || selectedDefaulDestination || '';
    const destination = searchParams.get('destination') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const adultsParam = searchParams.get('adults') || '0';
    const childrenParam = searchParams.get('children') || '0';
    const town = searchParams.get('town') || '';
    const hotel_id = searchParams.get('hotel_id') || '';
    const operator = searchParams.get('operator') || '';
    const mealPlan = searchParams.get('meal') || '';
    const rating = searchParams.get('rating') || '';
    const duration = searchParams.get('duration') || '';
    const from_cache = searchParams.get('from_cache') || '';
    const hotelIdParam = searchParams.get("hotel_id");
  if (hotelIdParam) {
    setHotelID(hotelIdParam); // statega yozib qo‘yish
  } else {
    setHotelID(null);
  }


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

    localStorage.setItem('town', town);
    localStorage.setItem('mealPlan', mealPlan);
    const filterData = {
      from: departure,
      where: destination,
      date: dateFrom,
      operator: operator,
      toDate: dateTo,
      town: town,
      mealPlan: mealPlan,
      hotel_id: hotel_id,
      selectData:
        dateFrom && dateTo
          ? `${formatDate.format(new Date(dateFrom), 'DD/MM/YYYY')} - ${formatDate.format(new Date(dateTo), 'DD/MM/YYYY')}`
          : '',
      adults: parseInt(adultsParam),
      children: parseInt(childrenParam),
    };
    // setFilterLocal(filterData);
    setFilterLocal(prev => {
    if (isEqualState(prev, filterData)) {
      return prev; // ❌ set qilmaydi → re-render yo‘q
    }
  
    return filterData; // ✅ faqat o‘zgarsa
  });
   
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

  // let toastShown = false;
 const { data: ticket, isLoading, isFetching, isError, error, refetch } = useQuery<TickectAll>({
    queryKey: [
      'ticket_all',
      filterLocal?.from,
      filterLocal?.where,
      filterLocal?.adults,
      filterLocal?.children,
      filterLocal?.date,
      filterLocal?.toDate,
      filterLocal?.town,
      filterLocal?.hotel_id,
      filterLocal?.mealPlan,
      currentPage,
      selectedDurations,
      hotelRating, 
    
    ],
    queryFn: () => {
      

      const params: TickectAllFilter = {
        page: currentPage,
        page_size: 10,
        adults: filterLocal?.adults,
        children: filterLocal?.children,
        operator: filterLocal?.operator,
        departure: filterLocal ? filterLocal.from : '',
        destination: selectedDestinations === null ? '' : selectedDestinations,
        hotel_amenity: hotelAmenities ?? '',
        hotel_id: filterLocal?.hotel_id ?? '',
        town: filterLocal?.town ?? '',
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
        meal_plan: filterLocal?.mealPlan ?? '',
        hotel_feature: hotelFeature,
      };

      return Ticket_Api.GetAllTickets({
        params,
        paramsSerializer: (params: TickectAllFilter) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      });
    },
    staleTime: 0,
    gcTime: 0,
    placeholderData: undefined,
    enabled: Boolean(filterLocal),
   
  });

const displayedHotels = useMemo(() => {
  const currentRegion = filterLocal?.where ?? null;
  const newHotels = ticket?.data?.results?.hotels ?? [];

 
  if (
    currentRegion !== null &&
    prevRegionRef.current === currentRegion &&
    Array.isArray(prevHotelsRef.current)
  ) {
    return prevHotelsRef.current;
  }


  if (Array.isArray(newHotels) && newHotels.length > 0) {
    prevRegionRef.current = currentRegion;
    prevHotelsRef.current = newHotels;
    return newHotels;
  }


  return Array.isArray(prevHotelsRef.current) ? prevHotelsRef.current : [];
}, [ticket, filterLocal?.where]);

const prevCountry = useRef<string | null>(null);
const prevRegion = useRef<string | null>(null);
const top_duration = [
                {
                    "duration": 7,
                    "count": 123
                },
                {
                    "duration": 8,
                    "count": 73
                },
                {
                    "duration": 9,
                    "count": 47
                },
                {
                    "duration": 10,
                    "count": 23
                },
                {
                    "duration": 11,
                    "count": 17
                },
               
                {
                    "duration": 12,
                    "count": 6
                },
                {
                    "duration": 13,
                    "count": 5
                },
                {
                    "duration": 14,
                    "count": 5
                }
            ]
  // const initialized = useRef(false);
  useEffect(() => {
    if (ticket ) {

       if (
           filterLocal?.from !== prevCountry.current ||
            filterLocal?.where !== prevRegion.current
      ) {
      setHotelType(ticket.data.results.hotel_types);
      setHotelAmenities(ticket.data.results.hotel_amenities);
      setFeatures(ticket.data.results.hotel_features_by_type);

      // eski qiymatlarni yangilab qo‘yish
      prevCountry.current = filterLocal?.from || null;
      prevRegion.current = filterLocal?.where || null;
    }

   
      setDurationDays(top_duration);
      setDestinations(ticket.data.results.top_destinations);

      // initialized.current = true;
    }
  }, [
    ticket,
    filterLocal,
    setDurationDays,
    setDestinations,
    setHotelType,
    setHotelAmenities,
    setFeatures,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', currentPage.toString());

    router.replace(`/selectour?${params.toString()}`, { scroll: false });
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
    <div className="min-h-screen bg-[#FAFBFC] pb-20">
      <section className="bg-[#1A73E8] pb-[88px] pt-6 xl:h-[520px]">
        <div className="mx-auto w-full max-w-[1240px] px-4 xl:px-0">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<EastIcon fontSize="small" className="text-white/70" />}
            sx={{
              '& .MuiBreadcrumbs-separator': {
                mx: 1,
              },
            }}
          >
            <Link href="/" className="text-sm font-normal text-white">
              {t('Главная')}
            </Link>
            <p className="text-sm font-normal text-[#97B0D9]">{t('Подобрать тур')}</p>
          </Breadcrumbs>

          <div className="mt-16 flex flex-col items-center gap-6 text-center xl:mt-[68px]">
            <h1 className="w-full max-w-[1240px] text-3xl font-bold leading-[110%] text-white xl:text-[48px]">
              {t('Более 26 000 проверенных туров для вашего безупречного отдыха')}
            </h1>
            <p className="w-full max-w-[1240px] text-lg font-semibold leading-[29px] text-[#E8F1FF] xl:text-[24px]">
              {t('Лучшие предложения, отобранные вручную')}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: 'easeOut',
            }}
            className="mt-16 xl:mt-[68px]"
          >
            <FilterTours
              selectedDestRegions={selectedDestinations}
              setSelectedDestRegions={setSelectedDestinations}
              setSelectedDefaulDestination={setSelectedDefaulDestination}
              setHotelRating={setHotelRating}
              setSelectedDurations={setSelectedDurations}
              setMealPlan={setMealPlan}
              setIsSearchClicked={setIsSearchClicked}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: 'easeOut',
            }}
            className="mt-6"
          >
            <FilterToursMobile
              selectedDestRegions={selectedDestinations}
              setSelectedDestRegions={setSelectedDestinations}
              setSelectedDefaulDestination={setSelectedDefaulDestination}
              setHotelRating={setHotelRating}
              setSelectedDurations={setSelectedDurations}
              setMealPlan={setMealPlan}
            />
          </motion.div>
        </div>
      </section>

      <div className="custom-container  mt-[104px] mx-auto flex w-full max-w-[1240px] gap-6 max-lg:flex-col">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="hidden h-max w-[292px] shrink-0 flex-col gap-4 max-lg:hidden lg:flex"
        >
          <div className="flex h-[72px] w-full items-center gap-4 rounded-[14px] bg-white px-4 py-6 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            <FilterListIcon sx={{ color: '#1A73E8', fontSize: 24 }} />
            <p className="text-base font-bold leading-5 text-[#1A73E8]">
              {t('Настройте свой отдых')}
            </p>
          </div>
          <div className="flex h-[56px] w-full items-center justify-between rounded-[14px] bg-white px-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-4">
              <FilterListIcon sx={{ color: '#1A73E8', fontSize: 24 }} />
              <p className="text-sm font-medium leading-[17px] text-[#6B7280]">
                {t('По возрастанию цены')}
              </p>
            </div>
            <KeyboardArrowDownIcon sx={{ color: '#6B7280', fontSize: 16 }} />
          </div>

          <div className="hidden w-full rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <FilterSection title={t('Стоимость')} icon={<BadgeDollarSign size={24} color="#1A73E8" />}>
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
          </div>

    

          {/* <FilterSection title={t('Условия въезда')}>
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
          </FilterSection> */}

          <div className="h-[360px] w-full overflow-hidden rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <FilterSection title={t('Продолжительность тура')} icon={<Clock3 size={24} color="#1A73E8" />}>
            {top_duration &&
              [...top_duration]
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
          </div>

          <div className="h-[385px] w-full overflow-hidden rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
         <FilterSection title={t('Страна')} icon={<Flag size={24} color="#1A73E8" />}>
          {country &&
            (() => {
              // Tanlangan regionni topamiz
              const selectedRegionObj = country
                .flatMap((c) => c.regions)
                .find((r) => String(r.id) === selectedDestinations);

              if (!selectedRegionObj) {
                return null; // Agar tanlanmagan bo‘lsa hech narsa chiqmaydi
              }
              // console.log('Selected Region Object:', selectedRegionObj); // Tanlangan regionni konsolga chiqaramiz
              return (
                <div key={selectedRegionObj.id}>
                  {/* <CheckboxFilter
                    value={String(selectedRegionObj.id)}
                    label={selectedRegionObj.name}
                    setChecked={setSelectedDestinations}
                    selectedValue={selectedDestinations}
                    exclusive
                    paramName="destination"
                  /> */}

                  {Array.isArray(selectedRegionObj.towns) &&
                    selectedRegionObj.towns.length > 0 &&
                    selectedRegionObj.towns.map((town) => (
                      <CheckboxFilter
                       onclick={setCurrentPage}
                        key={town.id}
                        value={String(town.id)}
                        label={<span className="pl-6">{town.name}</span>}

                        // setChecked={setSelectedTown}   // endi town uchun alohida state
                          setChecked={(val) => {
                              setSelectedTown(val);

                              const params = new URLSearchParams(searchParams.toString());
                              if (val) {
                                params.set("town", typeof val === 'string' ? val : '');
                              } else {
                                params.delete("town"); // ❌ check olib tashlansa URL’dan o‘chadi
                              }
                              router.replace(`/selectour?${params.toString()}`, { scroll: false });
                            }}
                        selectedValue={selectedTown}
                        exclusive
                        paramName="town"
                      />
                    ))}
                  <p className="mt-3 w-full text-right text-xs font-medium text-[#6B7280] underline">
                    {t('Еще')}
                  </p>
                </div>
              );
            })()}
        </FilterSection>
        </div>

          <div className="w-full rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
<FilterSection title={t('Категория отеля')} defaultHidden icon={<StarIcon sx={{ fontSize: 24, color: '#1A73E8' }} />}>
  {["5","4","3","2"].map((rating) => (
    <CheckboxFilter
      key={rating}
      value={rating}
      label={t(`${rating} звезды`)}
      setChecked={(val) => {
        setHotelRating(val ? rating : null);
        setCurrentPage(1);

        // URL parametrlardan hotel_id va operatorni olib tashlash
        const params = new URLSearchParams(window.location.search);
        params.delete("hotel_id");
        params.delete("operator");

        router.push(`/selectour?${params.toString()}`);
      }}
      selectedValue={hotelRating}
      exclusive
      paramName="rating"
    />
  ))}
</FilterSection>
</div>

          {/* <FilterSection title={t('Тип отеля')}>
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
          </FilterSection> */}

          <div className="w-full rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
       <FilterSection title={t('Отель')} defaultHidden icon={<Building2 size={24} color="#1A73E8" />}>
        {displayedHotels.map((hotel) => (
          <CheckboxFilter
            key={hotel.id}
            value={String(hotel.id)}
            label={
              <span className="flex flex-wrap items-center gap-2">
                <span>{hotel.name}</span>
                <span className="text-sm text-[#909091]">
                  {typeof hotel.rating === 'number' ? `${hotel.rating}★` : hotel.rating}
                </span>
              </span>
            }
            setChecked={(val) => {
              console.log("VAL ", val)
              
              // URL parametrlarga qo‘shish
              const params = new URLSearchParams(window.location.search);
              if (val) {
                setHotelID(String(hotel.id));
                
                params.set('hotel_id', String(hotel.id));
                params.set('operator', String(hotel.operator));
              }else{
                setHotelID(null);
                params.delete('hotel_id');
                params.delete('operator');

              }

              router.push(`/selectour?${params.toString()}`);
            }}
            selectedValue={hotelID}
            exclusive
            // paramName="hotel_name"
          />
        ))}
      </FilterSection>
      </div>


          <div className="w-full rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <FilterSection title={t('Питание')} defaultHidden icon={<Utensils size={24} color="#1A73E8" />}>
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
          </div>

          <div className="w-full rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <FilterSection title={t('Цена')} icon={<BadgeDollarSign size={24} color="#1A73E8" />}>
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
            <div className="mt-3 flex justify-between rounded-xl border border-[#DFDFDF] p-3">
              <input
                type="text"
                value={formatPrice(priceRange[0])}
                placeholder="2 500 000"
                onChange={(e) => {
                  handleInputChange(e.target.value, 0);
                  setCurrentPage(1);
                }}
                className={clsx(
                  'w-1/2 border-none text-xs leading-3 outline-none',
                  priceRange[0] ? 'text-[#848484]' : 'text-[#909091]',
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
                  'w-1/2 border-none text-right text-xs leading-3 outline-none',
                  priceRange[1] ? 'text-[#848484]' : 'text-[#909091]',
                )}
              />
            </div>
          </FilterSection>
          </div>
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
              {t('Фильтры')}
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
                value={hotelName}
                placeholder={t('Название отеля')}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 outline-none"
              />
            </FilterSection>

            {/* <FilterSection title={t('Условия въезда')}>
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
            </FilterSection> */}

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
            (() => {
              // Tanlangan regionni topamiz
              const selectedRegionObj = country
                .flatMap((c) => c.regions)
                .find((r) => String(r.id) === selectedDestinations);

              if (!selectedRegionObj) {
                return null; // Agar tanlanmagan bo‘lsa hech narsa chiqmaydi
              }
              // console.log('Selected Region Object:', selectedRegionObj); // Tanlangan regionni konsolga chiqaramiz
              return (
                <div key={selectedRegionObj.id}>
                  {/* <CheckboxFilter
                    value={String(selectedRegionObj.id)}
                    label={selectedRegionObj.name}
                    setChecked={setSelectedDestinations}
                    selectedValue={selectedDestinations}
                    exclusive
                    paramName="destination"
                  /> */}

                  {Array.isArray(selectedRegionObj.towns) &&
                    selectedRegionObj.towns.length > 0 &&
                    selectedRegionObj.towns.map((town) => (
                      <CheckboxFilter
                        key={town.id}
                        value={String(town.id)}
                        label={<span className="pl-6">{town.name}</span>}
                        
                        onclick={setCurrentPage}
                        // setChecked={setSelectedTown}   // endi town uchun alohida state
                          setChecked={(val) => {
                              setSelectedTown(val);

                              const params = new URLSearchParams(searchParams.toString());
                              if (val) {
                                params.set("town", typeof val === 'string' ? val : '');
                              } else {
                                params.delete("town"); // ❌ check olib tashlansa URL’dan o‘chadi
                              }
                              router.replace(`/selectour?${params.toString()}`, { scroll: false });
                            }}
                        selectedValue={selectedTown}
                        exclusive
                        paramName="town"
                      />
                    ))}
                </div>
              );
            })()}
            </FilterSection>
<FilterSection title={t('Категория отеля')}>
  {["5","4","3","2"].map((rating) => (
    <CheckboxFilter
      key={rating}
      value={rating}
      label={t(`${rating} звезды`)}
      setChecked={(val) => {
        setHotelRating(val ? rating : null);
        setCurrentPage(1);

        // URL parametrlardan hotel_id va operatorni olib tashlash
        const params = new URLSearchParams(window.location.search);
        params.delete("hotel_id");
        params.delete("operator");

        router.push(`/selectour?${params.toString()}`);
      }}
      selectedValue={hotelRating}
      exclusive
      paramName="rating"
    />
  ))}
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

            <FilterSection title={t('Отели')}>
              {displayedHotels.map((hotel) => (
                <CheckboxFilter
                  key={hotel.id}
                  value={String(hotel.id)}
                  label={
                    <span className="flex flex-wrap items-center gap-2">
                      <span>{hotel.name}</span>
                      <span className="text-sm text-[#909091]">
                        {typeof hotel.rating === 'number' ? `${hotel.rating}★` : hotel.rating}
                      </span>
                    </span>
                  }
                  onclick={setCurrentPage}
                  // setChecked={setHotelName}
                  selectedValue={hotelID}
                  exclusive
                   setChecked={(val) => {
                     console.log("VAL ", val)
                     const params = new URLSearchParams(window.location.search);
                     if(val){
                      setHotelID(String(hotel.id));
                       params.set('hotel_id', String(hotel.id));
                       params.set('operator', String(hotel.operator));
                      }else{
                          setHotelID(null);
                          params.delete('hotel_id');
                          params.delete('operator');

                        }

                        router.push(`/selectour?${params.toString()}`);
                      }}
                  // paramName="hotel_name"
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

        <div className="flex w-full max-w-[924px] flex-col justify-between">
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
              <div className="w-full flex  justify-between items-center max-lg:flex-col max-lg:items-start max-lg:gap-5">
                <h1 className="font-bold text-2xl text-start flex items-center gap-1 max-md:text-lg max-sm:text-sm">
                  {regionName ? (
                    <>
                      <span>{countryName}</span>
                      <KeyboardArrowRightIcon />
                      <span>
                        {regionName} {ticket && ticket ? t('ga tegishli') : ''}
                      </span>
                    </>
                  ) : (
                    t('Filter uchun Kerakli davlat va shaharni tanlang')
                  )}{' '}
                  {ticket && (regionName || ticket?.data?.total_items > 0) ? (
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

            <div className="mt-6">
              {!filterLocal ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[14px] bg-white">
                  <Player
                    autoplay
                    loop
                    src={loaderAnimation}
                    style={{ height: '180px', width: '180px' }}
                  />
                  <p className="mt-2 text-base font-medium text-[#6B7280]">
                    {t('Подготавливаем параметры поиска...')}
                  </p>
                </div>
              ) : isLoading || isFetching ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[14px] bg-white">
                  <Player
                    autoplay
                    loop
                    src={loaderAnimation}
                    style={{ height: '180px', width: '180px' }}
                  />
                  <p className="mt-2 text-base font-medium text-[#6B7280]">{t('Загрузка туров...')}</p>
                </div>
              ) : isError ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[14px] bg-white px-6 text-center">
                  <p className="text-xl font-semibold text-[#121212]">
                    {t('Не удалось загрузить туры')}
                  </p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    {(error as Error)?.message || t('Проверьте интернет и попробуйте снова')}
                  </p>
                  <Button
                    onClick={() => refetch()}
                    className="mt-6 rounded-[12px] bg-[#1A73E8] px-6 py-2 text-white"
                  >
                    {t('Повторить')}
                  </Button>
                </div>
              ) : (
                <>
               
                  {ticket && ticket?.data?.results.tickets.length > 0 ? (
                   
                    <div className="flex flex-col gap-6">
                    {ticket?.data?.results.tickets.map((item: any) => (
                      <TourItem key={item.id} data={item} />
                    ))}
                    </div>
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
