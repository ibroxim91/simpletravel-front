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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
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
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import Ticket_Api, { hotel_meal_plan } from '../lib/api';
import { ensureDestinationInParams } from '../lib/ensureDestinationParams';
import { useFilterTickectsStore } from '../lib/store';
import { TickectAll, TickectAllFilter } from '../lib/types';
import CheckboxFilter from './CheckBox';
import FilterSection from './FilterSection';
import TourItem from '@/widgets/selectour/ui/TourItem';
import { useMemo } from "react";
import CircleLoader from './TourLoader';
import {UseAnimatedNumber} from './useAnimatedNumber'

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
  country_id?: string;
  operator?: string;
  town?: string;
  hotel_id?: string;
  mealPlan?: string;
};

const isEqualState = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

type HotelListItem = NonNullable<
  TickectAll['data']['results']['hotels']
>[number];

const sortHotelsByRating = (hotels: HotelListItem[]) =>
  [...hotels].sort((a, b) => {
    const aIsNumber = typeof a.rating === 'number';
    const bIsNumber = typeof b.rating === 'number';

    if (aIsNumber && bIsNumber) {
      const aRating = a.rating as number;
      const bRating = b.rating as number;
      if (aRating !== bRating) return aRating - bRating;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    }

    if (aIsNumber) return -1;
    if (bIsNumber) return 1;

    const ratingCompare = String(a.rating).localeCompare(
      String(b.rating),
      undefined,
      { sensitivity: 'base' },
    );
    if (ratingCompare !== 0) return ratingCompare;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

type StreamTicketCache = {
  key: string;
  tickets: any[];
  hotels: HotelListItem[];
  totalItems: number;
  totalPages: number;
  minPrice: number;
  maxPrice: number;
  createdAt: number;
};

function buildStreamSearchKey(values: Record<string, unknown>) {
  return JSON.stringify(values);
}

function getStreamTicketCache(): StreamTicketCache | null {
  try {
    const raw = localStorage.getItem('stream_ticket_cache');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStreamTicketCache(key: string, data: Omit<StreamTicketCache, 'key' | 'createdAt'>) {
  const payload: StreamTicketCache = {
    key,
    ...data,
    createdAt: Date.now(),
  };
  localStorage.setItem('stream_ticket_cache', JSON.stringify(payload));
}

function calcPriceBounds(tickets: { price_full?: number }[]) {
  const prices = tickets
    .map((t) => t.price_full)
    .filter((p): p is number => typeof p === 'number' && p > 0);
  if (prices.length === 0) {
    return { min: 2_500_000, max: 100_000_000 };
  }
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export default function SelectourTest() {
  const params = useParams<{ locale: LanguageRoutes }>();
  const locale = params?.locale as LanguageRoutes;
  const t = useTranslations();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
   const prevRegionRef = useRef<string | null>(null);
const prevHotelsRef = useRef<any[] | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<number[]>([]);
  const [streamPriceBounds, setStreamPriceBounds] = useState({
    min: 2_500_000,
    max: 100_000_000,
  });
  const prevFilterBaseKeyRef = useRef('');
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

  const streamUrl = process.env.NEXT_PUBLIC_TICKETS_API_URL + '/stream-samo/tickets';
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
  const searchParamsString = searchParams?.toString() ?? '';
  const getSearchParam = (key: string) => searchParams?.get(key) ?? '';

  // STREAM-BASED STATES
  const [streamTickets, setStreamTickets] = useState<any[]>([]);
  const [streamHotels, setStreamHotels] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamTotal, setStreamTotal] = useState(0);
  const [streamTotalPages, setStreamTotalPages] = useState(0);
  const [streamTotalItems, setStreamTotalItems] = useState(0);
  const [streamFromCache, setStreamFromCache] = useState(false);

  const priceLimits = useMemo(() => {
    if (streamPriceBounds.min < streamPriceBounds.max) {
      return streamPriceBounds;
    }
    return { min: 2_500_000, max: 100_000_000 };
  }, [streamPriceBounds]);

  const sliderValue =
    priceRange.length === 2
      ? priceRange
      : [priceLimits.min, priceLimits.max];

  const applyPriceFilter = (range: number[]) => {
    const clampedMin = Math.max(
      priceLimits.min,
      Math.min(range[0], priceLimits.max),
    );
    const clampedMax = Math.max(
      clampedMin,
      Math.min(range[1], priceLimits.max),
    );
    const nextRange = [clampedMin, clampedMax];
    setPriceRange(nextRange);
    setAppliedPriceRange(nextRange);
    setCurrentPage(1);
  };

  const applyDestinationFallback = (params: URLSearchParams) => {
    ensureDestinationInParams(params, {
      destination: filterLocal?.where || selectedDestinations,
      country_id: filterLocal?.country_id,
    });
  };

  const handleInputChange = (value: string, index: number) => {
    const numericValue = Number(value.replace(/\s/g, '')) || 0;
    const baseRange =
      priceRange.length === 2 ? [...priceRange] : [...sliderValue];
    baseRange[index] = numericValue;
    setPriceRange(baseRange);
  };

  const handlePriceInputBlur = () => {
    if (priceRange.length === 2) {
      applyPriceFilter(priceRange);
    }
  };

  const filterBaseKey = useMemo(
    () =>
      JSON.stringify({
        from: filterLocal?.from,
        where: filterLocal?.where,
        country_id: filterLocal?.country_id,
        date: filterLocal?.date,
        toDate: filterLocal?.toDate,
        town: filterLocal?.town,
        hotel_id: filterLocal?.hotel_id,
        mealPlan: filterLocal?.mealPlan,
        selectedDurations,
        hotelRating,
        cheaper,
        expensive,
      }),
    [
      filterLocal?.from,
      filterLocal?.where,
      filterLocal?.country_id,
      filterLocal?.date,
      filterLocal?.toDate,
      filterLocal?.town,
      filterLocal?.hotel_id,
      filterLocal?.mealPlan,
      selectedDurations,
      hotelRating,
      cheaper,
      expensive,
    ],
  );

  useEffect(() => {
    if (prevFilterBaseKeyRef.current !== filterBaseKey) {
      prevFilterBaseKeyRef.current = filterBaseKey;
      setPriceRange([]);
      setAppliedPriceRange([]);
    }
  }, [filterBaseKey]);

  useEffect(() => {
    if (priceRange.length === 0 && priceLimits.min < priceLimits.max) {
      setPriceRange([priceLimits.min, priceLimits.max]);
    }
  }, [priceLimits.min, priceLimits.max, priceRange.length]);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ratingParam = params.get("rating");
  if (ratingParam) {
    setHotelRating(ratingParam);
  }
}, []);


  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo === 'true') {
      window.scrollTo({
        top: 700,
        behavior: 'smooth',
      });
    }

    const departure = getSearchParam('departure') || selectedDefaulDestination || '';
    const destination = getSearchParam('destination') || '';
    const country_id = getSearchParam('country_id') || '';
    const dateFrom = getSearchParam('dateFrom') || '';
    const dateTo = getSearchParam('dateTo') || '';
    const adultsParam = getSearchParam('adults') || '0';
    const childrenParam = getSearchParam('children') || '0';
    const town = getSearchParam('town') || '';
    const hotel_id = getSearchParam('hotel_id') || '';
    const operator = getSearchParam('operator') || '';
    const mealPlan = getSearchParam('meal') || '';
    const rating = getSearchParam('rating') || '';
    const duration = getSearchParam('duration') || '';
    const from_cache = getSearchParam('from_cache') || '';
    const hotelIdParam = getSearchParam('hotel_id');
  if (hotelIdParam) {
    setHotelID(hotelIdParam); // statega yozib qo‘yish
  } else {
    setHotelID(null);
  }


    let newData = {
      departure:departure,
      from_cache:from_cache,
      destination:destination,
      country_id:country_id,
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
      country_id: country_id,
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

  // STREAM-BASED TICKET FETCHING WITH EventSource
  useEffect(() => {
    if (!filterLocal) return;

    const streamSearchValues: Record<string, unknown> = {
      page: currentPage,
      adults: filterLocal?.adults,
      children: filterLocal?.children,
      operator: filterLocal?.operator || '',
      departure: filterLocal?.from || '',
      destination: filterLocal?.where || '',
      country_id: filterLocal?.country_id || '',
      hotel_amenity: hotelAmenities || '',
      hotel_id: filterLocal?.hotel_id || '',
      town: filterLocal?.town || '',
      hotel_type: hotelType || '',
      cheapest: cheaper,
      most_expensive: expensive,
      dateFrom: filterLocal?.date || '',
      dateTo: filterLocal?.toDate || '',
      min_price:
        appliedPriceRange.length === 2 ? appliedPriceRange[0] : undefined,
      max_price:
        appliedPriceRange.length === 2 ? appliedPriceRange[1] : undefined,
      hotel_rating: hotelRating || '',
      duration_days: selectedDurations || '',
      meal_plan: filterLocal?.mealPlan || '',
      hotel_feature: hotelFeature,
    };

    const streamCacheKey = buildStreamSearchKey(streamSearchValues);
    const cachedStream = getStreamTicketCache();

    if (cachedStream && cachedStream.key === streamCacheKey) {
      setStreamTickets(cachedStream.tickets);
      setStreamHotels(cachedStream.hotels);
      setStreamTotalItems(cachedStream.totalItems);
      setStreamTotalPages(cachedStream.totalPages);
      setStreamTotal(cachedStream.totalItems);
      setStreamPriceBounds({
        min: cachedStream.minPrice,
        max: cachedStream.maxPrice,
      });
      setStreamFromCache(true);
      setIsStreaming(false);
      setStreamError(null);
      return;
    }

    setIsStreaming(true);
    setStreamError(null);
    setStreamTickets([]);
    setStreamHotels([]);
    setStreamTotalItems(0);
    setStreamTotal(0);
    setStreamFromCache(false);

    let es: EventSource | null = null;
    let allTickets: any[] = [];

    const mergeAndSort = (existing: any[], newItems: any[]) => {
      const merged = [...existing, ...newItems];
      merged.sort((a: any, b: any) => a.price_full - b.price_full);
      return merged;
    };

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: '10',
        adults: (filterLocal?.adults || 0).toString(),
        children: (filterLocal?.children || 0).toString(),
        operator: filterLocal?.operator || '',
        departure: filterLocal?.from || '',
        destination: filterLocal?.where || '',
        country_id: filterLocal?.country_id || '',
        hotel_amenity: hotelAmenities || '',
        hotel_id: filterLocal?.hotel_id || '',
        town: filterLocal?.town || '',
        hotel_type: hotelType || '',
        cheapest: cheaper ? 'true' : 'false',
        most_expensive: expensive ? 'true' : 'false',
        dateFrom: filterLocal?.date
          ? formatDate.format(filterLocal?.date, 'YYYY-MM-DD')
          : '',
        dateTo: filterLocal?.toDate
          ? formatDate.format(filterLocal?.toDate, 'YYYY-MM-DD')
          : '',
        visa_required: visa === 'visa' ? 'true' : visa === 'no_visa' ? 'false' : '',
        hotel_rating: hotelRating || '',
        duration_days: selectedDurations || '',
        meal_plan: filterLocal?.mealPlan || '',
      });

      if (appliedPriceRange.length === 2) {
        params.set('min_price', String(appliedPriceRange[0]));
        params.set('max_price', String(appliedPriceRange[1]));
      }

      hotelFeature.forEach((feature) => {
        params.append('hotel_feature', feature);
      });

      // const streamUrl = `https://search.simpletravel.uz/stream-samo/tickets?${params}`;

      es = new EventSource(streamUrl + '?' + params.toString());

      es.onopen = () => {
        console.log('EventSource connected');
      };

      // MAIN MESSAGE HANDLER - Render har message kelganda
      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log('Received payload:', payload);

          // Birinchi stream data keldi -> narx bo'yicha sort -> darhol render
          if (payload.prices && Array.isArray(payload.prices) && payload.prices.length > 0) {
            allTickets = mergeAndSort(allTickets, payload.prices);
            setStreamTickets(prev => {
                const updated = mergeAndSort(prev, payload.prices);
                return [...updated];
              });
               

          }

          // Set metadata
          if (payload.total !== undefined) {
            setStreamTotal(payload.total);
          }
          if (payload.total_pages !== undefined) {
            setStreamTotalPages(payload.total_pages);
          }
          if (payload.total_items !== undefined) {
            setStreamTotalItems(payload.total_items);
          }
          if (payload.from_cache !== undefined) {
            setStreamFromCache(payload.from_cache);
          }

          // Stream tugasi - hotels set qilib connection close qil
          if (payload.end) {
            console.log('Stream finished');
            const finalTotal =
              payload.total_items ?? payload.total ?? allTickets.length;

            setStreamTotalItems(finalTotal);
            setStreamTotal(finalTotal);
            if (payload.total_pages !== undefined) {
              setStreamTotalPages(payload.total_pages);
            }

            const bounds = calcPriceBounds(allTickets);
            if (payload.hotels) {
              setStreamHotels(payload.hotels);
            }
            setStreamPriceBounds(bounds);
            setIsStreaming(false);

            if (allTickets.length > 0) {
              saveStreamTicketCache(streamCacheKey, {
                tickets: allTickets,
                hotels: payload.hotels ?? [],
                totalItems: finalTotal,
                totalPages:
                  payload.total_pages ??
                  Math.max(1, Math.ceil(finalTotal / 100)),
                minPrice: bounds.min,
                maxPrice: bounds.max,
              });
            }

            es?.close();
          }
        } catch (parseError) {
          console.error('Error parsing message data:', event.data, parseError);
        }
      };

      es.onerror = (error) => {
        console.error('EventSource error:', error);
        const message = 'Stream connection error';
        setStreamError(message);
        setIsStreaming(false);
        es?.close();
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setStreamError(message);
      setIsStreaming(false);
      es?.close();
      console.error('Stream setup error:', err);
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (es) {
        es.close();
        console.log('EventSource closed');
      }
    };
  }, [
    filterLocal,
    currentPage,
    hotelAmenities,
    hotelType,
    cheaper,
    expensive,
    appliedPriceRange,
    visa,
    hotelRating,
    selectedDurations,
    hotelFeature,
    filterLocal?.country_id,
  ]);

  // Legacy useQuery for compatibility with other components
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
      cheaper,
      expensive,
    ],
    queryFn: () => {
      

      const params: TickectAllFilter = {
        page: currentPage,
        page_size: 10,
        adults: filterLocal?.adults,
        children: filterLocal?.children,
        operator: filterLocal?.operator,
        departure: filterLocal ? filterLocal.from : '',
        destination: filterLocal?.where ?? '',
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
    enabled: false, // Disabled since we're using streaming
   
  });

 
const animatedCountTarget = isStreaming
  ? streamTickets.length
  : streamTotalItems > 0
    ? streamTotalItems
    : streamTickets.length;

const animatedCount = UseAnimatedNumber(animatedCountTarget, 400);

const isHotelLocked = Boolean(
  searchParams.get('hotel_id') && searchParams.get('operator'),
);

const hotels = useMemo(() => {
  const apiHotels =
    streamHotels.length > 0
      ? streamHotels
      : (ticket?.data?.results?.hotels ?? []);

  if (isHotelLocked) {
    const list = prevHotelsRef.current?.length
      ? prevHotelsRef.current
      : apiHotels;
    return sortHotelsByRating(list);
  }

  if (apiHotels.length > 0) {
    const sorted = sortHotelsByRating(apiHotels);
    prevHotelsRef.current = sorted;
    return sorted;
  }

  return sortHotelsByRating(prevHotelsRef.current ?? []);
}, [streamHotels, ticket, isHotelLocked]);


const prevCountry = useRef<string | null>(null);
const prevRegion = useRef<string | null>(null);
const top_duration = [
                {"duration": 3},
                {"duration": 4},
                {"duration": 5},
                {"duration": 6},
                {"duration": 7},
                {"duration": 8},
                {"duration": 9},
                {"duration": 10},
                {"duration": 11},
                {"duration": 12},
                {"duration": 13},
                {"duration": 14},
                {"duration": 15},
                {"duration": 16},
                {"duration": 17},
                {"duration": 18},
                {"duration": 19},
                {"duration": 20},
                {"duration": 21}
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
    const params = new URLSearchParams(searchParamsString);
    params.set('page', currentPage.toString());

    router.replace(`/selectour-test?${params.toString()}`, { scroll: false });
  }, [currentPage, router, searchParams]);

  useEffect(() => {
    const pageParam = getSearchParam('page');
    if (pageParam) {
      setCurrentPage(Number(pageParam));
    }
  
  }, [searchParams]);

  const destinationRegionId = filterLocal?.where
    ? Number(filterLocal.where)
    : null;
  const destinationCountryId = filterLocal?.country_id || null;

  let regionName: string | undefined;
  let countryName: string | undefined;

  if (destinationRegionId && !Number.isNaN(destinationRegionId)) {
    const regionData = country?.find((c) =>
      c.regions.some((r) => r.id === destinationRegionId),
    );
    regionName = regionData?.regions.find(
      (r) => r.id === destinationRegionId,
    )?.name;
    countryName = regionData?.name;
  } else if (destinationCountryId) {
    countryName = country?.find(
      (c) => String(c.id) === destinationCountryId,
    )?.name;
  }

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

          <div className="mt-16 xl:mt-[68px]">
            <FilterTours
              selectedDestRegions={selectedDestinations}
              setSelectedDestRegions={setSelectedDestinations}
              setSelectedDefaulDestination={setSelectedDefaulDestination}
              setHotelRating={setHotelRating}
              setSelectedDurations={setSelectedDurations}
              setMealPlan={setMealPlan}
              setIsSearchClicked={setIsSearchClicked}
            />
          </div>
          <div className="mt-6">
            <FilterToursMobile
              selectedDestRegions={selectedDestinations}
              setSelectedDestRegions={setSelectedDestinations}
              setSelectedDefaulDestination={setSelectedDefaulDestination}
              setHotelRating={setHotelRating}
              setSelectedDurations={setSelectedDurations}
              setMealPlan={setMealPlan}
            />
          </div>
        </div>
      </section>

      <div className="custom-container mx-auto flex w-full max-w-[1240px] gap-6 max-lg:mt-8 max-lg:flex-col max-lg:px-5 lg:mt-[104px]">
        <div className="hidden h-max w-[292px] shrink-0 flex-col gap-4 max-lg:hidden lg:flex">
          <div className="flex h-[72px] w-full items-center gap-4 rounded-[14px] bg-[#FAFBFC] px-4 py-6">
            <FilterListIcon sx={{ color: '#1A73E8', fontSize: 24 }} />
            <p className="text-base font-bold leading-5 text-[#1A73E8]">
              {t('Настройте свой отдых')}
            </p>
          </div>
          <div className="flex h-[56px] w-full items-center justify-between rounded-[14px] bg-[#FAFBFC] px-4">
            <div className="flex items-center gap-4">
              <img src="/icons/sort.png" width="24px" alt="" />
               <Select
                  value={cheaper ? 'cheaper' : expensive ? 'expensive' : 'all'}
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
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full !h-[40px] flex items-center justify-between rounded-lg gap-4 border-none bg-[#FAFBFC]">
                    <SelectValue placeholder={t('По возрастанию цены')} />
                    <KeyboardArrowDownIcon />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('Все')}</SelectItem>
                    <SelectItem value="cheaper">{t('Подешевле')}</SelectItem>
                    <SelectItem value="expensive">{t('Подороже')}</SelectItem>
                  </SelectContent>
                </Select>
              {/* <FilterListIcon sx={{ color: '#1A73E8', fontSize: 24 }} />
              <p className="text-sm font-medium leading-[17px] text-[#6B7280]">
                {t('По возрастанию цены')}
              </p> */}
            </div>
            {/* <KeyboardArrowDownIcon sx={{ color: '#6B7280', fontSize: 16 }} /> */}
          </div>

          <div className="hidden w-full rounded-[14px] bg-[#FAFBFC] p-4">
          <FilterSection title={t('Стоимость')} icon='/icons/money.png'>
            <Slider
              range
              min={priceLimits.min}
              max={priceLimits.max}
              value={sliderValue}
              className="placeholder:!text-[#909091] !text-[#909091]"
              onChange={(v) => setPriceRange(v as number[])}
              onChangeComplete={(v) => applyPriceFilter(v as number[])}
            />
            <div className="flex justify-between mt-3 border border-[#DFDFDF] rounded-xl p-3">
              <input
                type="text"
                value={formatPrice(sliderValue[0])}
                placeholder={formatPrice(priceLimits.min)}
                onChange={(e) => handleInputChange(e.target.value, 0)}
                onBlur={handlePriceInputBlur}
                className={clsx(
                  'w-1/2 border-none outline-none',
                  sliderValue[0] ? 'text-[#212122]' : 'text-[#909091]',
                )}
              />
              <input
                type="text"
                value={formatPrice(sliderValue[1])}
                placeholder={formatPrice(priceLimits.max)}
                onChange={(e) => handleInputChange(e.target.value, 1)}
                onBlur={handlePriceInputBlur}
                className={clsx(
                  'w-1/2 border-none outline-none text-right',
                  sliderValue[1] ? 'text-[#212122]' : 'text-[#909091]',
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

          {/* <div className=" w-full overflow-hidden rounded-[14px] bg-[#FAFBFC] p-4">
          <FilterSection title={t('Длительность')} icon='/icons/time.png'>
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
          </div> */}
                    <div className=" w-full overflow-hidden rounded-[14px] bg-[#FAFBFC] p-4">
                    <FilterSection title={t('Длительность')} icon='/icons/time.png'>
                        {top_duration && (
                          <select
                            value={selectedDurations}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedDurations(value);
                              setCurrentPage(1);

                              const params = new URLSearchParams(window.location.search);
                              if (value) {
                                params.set("duration", value);
                              } else {
                                params.delete("duration");
                              }
                              applyDestinationFallback(params);
                              router.replace(`/selectour-test?${params.toString()}`, { scroll: false });
                            }}
                            className="w-full h-[40px] px-2 rounded bg-transparent border-none outline-none focus:ring-0"
                          >
                            <option value="">---</option>
                            {[...top_duration]
                              .sort((a, b) => a.duration - b.duration)
                              .map((e) => (
                                <option key={e.duration} value={String(e.duration)}>
                                  {e.duration} {t('ночей')}
                                </option>
                              ))}
                          </select>
                        )}
                      </FilterSection>


                    </div>

          <div className=" w-full overflow-hidden rounded-[14px] bg-[#FAFBFC] p-4">
         <FilterSection title={t('Регионы и курорты')} icon="/icons/country.png">
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
                    selectedRegionObj.towns.map((town, townIndex) => (
                      <CheckboxFilter
                       onclick={setCurrentPage}
                        key={`${town.id}-${townIndex}`}
                        value={String(town.id)}
                        label={<span className="pl-6">{town.name}</span>}

                        // setChecked={setSelectedTown}   // endi town uchun alohida state
                          setChecked={(val) => {
                              setSelectedTown(val);

                              const params = new URLSearchParams(searchParamsString);
                              if (val) {
                                params.set("town", typeof val === 'string' ? val : '');
                              } else {
                                params.delete("town");
                              }
                              applyDestinationFallback(params);
                              router.replace(`/selectour-test?${params.toString()}`, { scroll: false });
                            }}
                        selectedValue={selectedTown}
                        exclusive
                        paramName="town"
                      />
                    ))}
                  {/* <p className="mt-3 w-full text-right text-xs font-medium text-[#6B7280] underline">
                    {t('Еще')}
                  </p> */}
                </div>
              );
            })()}
        </FilterSection>
        </div>

          <div className="w-full rounded-[14px] bg-[#FAFBFC] p-4">
          <FilterSection title={t('Категория отеля')} defaultHidden icon="/icons/stars.png">
            {["5","4","3","2"].map((rating) => (
              <CheckboxFilter
                key={rating}
                value={rating}
                label={t(`${rating} звезды`)}
                setChecked={(val) => {
                  setHotelRating(val ? rating : null);
                  setCurrentPage(1);

                  const params = new URLSearchParams(window.location.search);
                  params.delete("hotel_id");
                  params.delete("operator");
                  if (val) {
                    params.set("rating", rating);
                  } else {
                    params.delete("rating");
                  }
                  applyDestinationFallback(params);
                  router.push(`/selectour-test?${params.toString()}`);
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

          <div className="w-full rounded-[14px] bg-[#FAFBFC] p-4">
       <FilterSection title={t('Отель')} defaultHidden icon="/icons/hotel.png">
        {hotels.length > 0 ? (
          hotels.map((hotel, hotelIndex) => (
            <CheckboxFilter
              key={`${hotel.id}-${hotelIndex}`}
              value={String(hotel.id)}
              label={
                <span className="flex flex-wrap items-center gap-2">
                  <span>{hotel.name}</span>
                  <span className="text-sm text-[#909091]">
                    {typeof hotel.rating === 'number'
                      ? `${hotel.rating}★`
                      : hotel.rating}
                  </span>
                </span>
              }
              setChecked={(val) => {
                const params = new URLSearchParams(window.location.search);
                if (val) {
                  setHotelID(String(hotel.id));
                  params.set('hotel_id', String(hotel.id));
                  params.set('operator', String((hotel as any).operator ?? ''));
                } else {
                  setHotelID(null);
                  params.delete('hotel_id');
                  params.delete('operator');
                }
                applyDestinationFallback(params);
                router.push(`/selectour-test?${params.toString()}`);
              }}
              selectedValue={hotelID}
              exclusive
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">{t('Отели не найдены')}</p>
        )}
      </FilterSection>
      </div>


          <div className="w-full rounded-[14px] bg-[#FAFBFC] p-4">
          <FilterSection title={t('Питание')} defaultHidden icon="/icons/meal-2.png">
            {meal?.map((e, mealIndex) => (
              <CheckboxFilter
                value={String(e.id)}
                label={e.name}
                key={`${e.id}-${mealIndex}`}
                onclick={setCurrentPage}
                setChecked={setMealPlan}
                selectedValue={mealPlan}
                exclusive
                paramName="meal"
              />
            ))}
          </FilterSection>
          </div>

          <div className="w-full rounded-[14px] bg-[#FAFBFC] p-4">
          <FilterSection title={t('Цена')}  icon="/icons/money.png">
            <Slider
              range
              min={priceLimits.min}
              max={priceLimits.max}
              value={sliderValue}
              className="placeholder:!text-[#909091] !text-[#909091]"
              onChange={(v) => setPriceRange(v as number[])}
              onChangeComplete={(v) => applyPriceFilter(v as number[])}
            />
            <div className="mt-3 flex justify-between rounded-xl border border-[#DFDFDF] p-3">
              <input
                type="text"
                value={formatPrice(sliderValue[0])}
                placeholder={formatPrice(priceLimits.min)}
                onChange={(e) => handleInputChange(e.target.value, 0)}
                onBlur={handlePriceInputBlur}
                className={clsx(
                  'w-1/2 border-none text-xs leading-3 outline-none',
                  sliderValue[0] ? 'text-[#848484]' : 'text-[#909091]',
                )}
              />
              <input
                type="text"
                value={formatPrice(sliderValue[1])}
                placeholder={formatPrice(priceLimits.max)}
                onChange={(e) => handleInputChange(e.target.value, 1)}
                onBlur={handlePriceInputBlur}
                className={clsx(
                  'w-1/2 border-none text-right text-xs leading-3 outline-none',
                  sliderValue[1] ? 'text-[#848484]' : 'text-[#909091]',
                )}
              />
            </div>
          </FilterSection>
          </div>
        </div>


        <div className="flex w-full max-w-[924px] flex-col justify-between">
          <div>
            <div>
              <div className="flex w-full items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-0">
                <h1 className="flex items-center gap-1 text-start text-2xl font-bold max-lg:hidden">
                  {regionName || countryName ? (
                    <>
                      <span>{countryName}</span>
                      {regionName ? (
                        <>
                          <KeyboardArrowRightIcon />
                          <span>{regionName}</span>
                        </>
                      ) : null}
                      {/* <span>
                        {!isStreaming ? t('ga tegishli') : ''}
                      </span> */}
                    </>
                  ) : (
                    t('Filter uchun Kerakli davlat va shaharni tanlang')
                  )}{' '}
                  {(regionName || countryName || streamTotalItems > 0 || isStreaming) ? (
                    <>
                    
                      {animatedCount} {t('ta tur topildi')}
                      {isStreaming && (
                        <span className="text-sm font-normal text-[#8E8E93]  animate-pulse ml-2">
                          {t('run_search')}
                        </span>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </h1>

                <div className="flex flex-col items-start gap-2 lg:hidden">
                  <p className="text-[20px] font-bold leading-6 text-[#1C1C1E]">
                    {regionName || countryName ? (
                      <>
                        <span>{countryName}</span>
                        {regionName && (
                          <>
                            <KeyboardArrowRightIcon />
                            <span>{regionName}</span>
                          </>
                        )}
                      </>
                    ) : (
                      t('Filter uchun Kerakli davlat va shaharni tanlang')
                    )}
                  </p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#1C1C1E]">
                    {(regionName || countryName || streamTotalItems > 0 || isStreaming) ? (
                      <>
                        
                        {animatedCount} {t('ta tur topildi')}
                        {isStreaming && (
                          <span className="text-[12px] font-normal text-[#8E8E93]  animate-pulse ml-2">
                            {t('run_search')}
                          </span>
                        )}
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                </div>

                {/* <Select
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
                </Select> */}



              </div>
            </div>

            <div className="lg:hidden">
              <div className="flex w-full items-center justify-between gap-3 max-lg:mt-[24px]">
                <button
                  type="button"
                  className="flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-[14px] bg-[#FAFBFC] px-4 py-2 text-left"
                  onClick={() => setFilter(true)}
                >
                  <FilterListIcon sx={{ color: '#1A73E8', fontSize: 18 }} className="shrink-0" />
                  <span className="truncate text-[14px] font-bold leading-[17px] text-[#1A73E8]">
                    {t('Настройте свой отдых')}
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={t('По возрастанию цены')}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-[#FAFBFC] p-[10px] outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40"
                    >
                      <img src="/icons/sort.png" alt="" className="h-4 w-4" width={16} height={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[10rem]">
                    <DropdownMenuItem
                      className={clsx(!cheaper && !expensive && 'bg-accent')}
                      onSelect={() => {
                        setCheaper(false);
                        setExpensive(false);
                        setCurrentPage(1);
                      }}
                    >
                      {t('Все')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={clsx(cheaper && !expensive && 'bg-accent')}
                      onSelect={() => {
                        setCheaper(true);
                        setExpensive(false);
                        setCurrentPage(1);
                      }}
                    >
                      {t('Подешевле')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={clsx(!cheaper && expensive && 'bg-accent')}
                      onSelect={() => {
                        setCheaper(false);
                        setExpensive(true);
                        setCurrentPage(1);
                      }}
                    >
                      {t('Подороже')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Drawer
                anchor="bottom"
                open={openFilter}
                onClose={() => setFilter(false)}
                ModalProps={{
                  keepMounted: true,
                }}
                BackdropProps={{
                  sx: {
                    backgroundColor: 'rgba(238, 238, 238, 0.4)',
                    backdropFilter: 'blur(5.43656px)',
                    WebkitBackdropFilter: 'blur(5.43656px)',
                  },
                }}
                PaperProps={{
                  sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    width: '100%',
                    height: 'calc(100vh - 84px)',
                    maxHeight: 'calc(100vh - 84px)',
                    overflow: 'hidden',
                    backgroundColor: '#FAFBFC',
                  },
                }}
              >
                <div className="flex h-full flex-col">
                  <div className="sticky top-0 z-10 mb-1 flex items-center justify-between border-b border-[#E5E7EB] bg-[#FAFBFC] px-4 py-4">
                <h2 className="text-[18px] font-semibold leading-6 text-[#121212]">
                  {t('Настройте свой отдых')}
                </h2>
                <Button
                  variant={'outline'}
                  className="h-[40px] w-[40px] cursor-pointer rounded-full"
                  onClick={() => setFilter(false)}
                >
                  <CloseIcon sx={{ color: 'black' }} />
                </Button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-28 pt-3">
                <FilterSection title={t('Стоимость')} icon="/icons/money.png">
                  <Slider
                    range
                    min={priceLimits.min}
                    max={priceLimits.max}
                    value={sliderValue}
                    onChange={(v) => setPriceRange(v as number[])}
                    onChangeComplete={(v) => applyPriceFilter(v as number[])}
                  />
                  <div className="mt-3 flex justify-between rounded-xl border border-[#DFDFDF] p-3">
                    <input
                      type="text"
                      value={formatPrice(sliderValue[0])}
                      placeholder={formatPrice(priceLimits.min)}
                      onChange={(e) => handleInputChange(e.target.value, 0)}
                      onBlur={handlePriceInputBlur}
                      className="w-1/2 border-none text-gray-600 outline-none"
                    />
                    <input
                      type="text"
                      value={formatPrice(sliderValue[1])}
                      placeholder={formatPrice(priceLimits.max)}
                      onChange={(e) => handleInputChange(e.target.value, 1)}
                      onBlur={handlePriceInputBlur}
                      className="w-1/2 border-none text-right text-gray-600 outline-none"
                    />
                  </div>
                </FilterSection>

            {/* <FilterSection title={t('Название отеля')} icon="/icons/hotel.png">
              <input
                type="text"
                value={hotelName}
                placeholder={t('Название отеля')}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 outline-none"
              />
            </FilterSection> */}

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

            <FilterSection title={t('Продолжительность тура')} icon="/icons/time.png">
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

            <FilterSection title={t('Регионы и курорты')} icon="/icons/country.png">
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
                    selectedRegionObj.towns.map((town, townIndex) => (
                      <CheckboxFilter
                        key={`${town.id}-${townIndex}`}
                        value={String(town.id)}
                        label={<span className="pl-6">{town.name}</span>}
                        
                        onclick={setCurrentPage}
                        // setChecked={setSelectedTown}   // endi town uchun alohida state
                          setChecked={(val) => {
                              setSelectedTown(val);

                              const params = new URLSearchParams(searchParamsString);
                              if (val) {
                                params.set("town", typeof val === 'string' ? val : '');
                              } else {
                                params.delete("town");
                              }
                              applyDestinationFallback(params);
                              router.replace(`/selectour-test?${params.toString()}`, { scroll: false });
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
<FilterSection title={t('Категория отеля')} icon="/icons/stars.png">
  {["5","4","3","2"].map((rating) => (
    <CheckboxFilter
      key={rating}
      value={rating}
      label={t(`${rating} звезды`)}
      setChecked={(val) => {
        setHotelRating(val ? rating : null);
        setCurrentPage(1);

        const params = new URLSearchParams(window.location.search);
        params.delete("hotel_id");
        params.delete("operator");
        if (val) {
          params.set("rating", rating);
        } else {
          params.delete("rating");
        }
        applyDestinationFallback(params);
        router.push(`/selectour-test?${params.toString()}`);
      }}
      selectedValue={hotelRating}
      exclusive
      paramName="rating"
    />
  ))}
</FilterSection>

            <FilterSection title={t('Питание')} icon="/icons/meal-2.png">
              {meal?.map((e, mealIndex) => (
                <CheckboxFilter
                  value={String(e.id)}
                  label={e.name}
                  key={`${e.id}-${mealIndex}`}
                  onclick={setCurrentPage}
                  setChecked={setMealPlan}
                  selectedValue={mealPlan}
                  exclusive
                  paramName="meal"
                />
              ))}
            </FilterSection>

            <FilterSection title={t('Тип отеля')} icon="/icons/stars.png">
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

            <FilterSection title={t('Отели')} icon="/icons/hotel.png">
              {hotels.length > 0 ? (
                hotels.map((hotel, hotelIndex) => (
                  <CheckboxFilter
                    key={`${hotel.id}-${hotelIndex}`}
                    value={String(hotel.id)}
                    label={
                      <span className="flex flex-wrap items-center gap-2">
                        <span>{hotel.name}</span>
                        <span className="text-sm text-[#909091]">
                          {typeof hotel.rating === 'number'
                            ? `${hotel.rating}★`
                            : hotel.rating}
                        </span>
                      </span>
                    }
                    onclick={setCurrentPage}
                    selectedValue={hotelID}
                    exclusive
                    setChecked={(val) => {
                      const params = new URLSearchParams(window.location.search);
                      if (val) {
                        setHotelID(String(hotel.id));
                        params.set('hotel_id', String(hotel.id));
                        params.set('operator', String((hotel as any).operator ?? ''));
                      } else {
                        setHotelID(null);
                        params.delete('hotel_id');
                        params.delete('operator');
                      }
                      applyDestinationFallback(params);
                      router.push(`/selectour-test?${params.toString()}`);
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">{t('Отели не найдены')}</p>
              )}
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

            {/* <FilterSection title={t('Дополнительно')}>
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
            </FilterSection> */}
              </div>

              <div className="sticky bottom-0 left-0 z-10 grid w-full grid-cols-2 gap-3 
              border-t border-[#E5E7EB] bg-[#FAFBFC] px-4 py-4">
                <button
                  className="h-12 w-full rounded-[14px] border border-[#1A73E8] bg-[#FAFBFC] 
                  text-[14px] font-medium text-[#1A73E8]"
                  onClick={() => setFilter(false)}
                >
                  {t('Отмена')}
                </button>
                <button
                  className="h-12 w-full rounded-[14px] bg-[#1A73E8] text-[14px] font-medium text-white"
                  onClick={() => {
                    setFilter(false);
                  }}
                >
                  {t('Применять')}
                </button>
              </div>
            </div>
              </Drawer>
            </div>

            <div className="max-lg:mt-[31px] lg:mt-6">
              {!filterLocal ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[14px] bg-[#FAFBFC]">
                  <Player
                    autoplay
                    loop
                    src={loaderAnimation}
                    style={{ height: '180px', width: '180px' }}
                  />
                  <p className="mt-2 text-base font-medium text-[#6B7280]">
                    {t('Подготавливаем параметры поиска')}
                  </p>
                </div>
              ) : isStreaming ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[14px] bg-[#FAFBFC]">
                 
                 {streamTickets.length > 0 && (
                      <div className="mt-4 w-full">
                        <div className="flex flex-col gap-6">
                          {streamTickets.map((item: any, itemIndex: number) => (
                            <TourItem key={`${item.id}-${itemIndex}`} data={item} />
                          ))}
                        </div>
                      </div>
                    )}
                 
                 
                  <CircleLoader />
                  <p className="mt-2 text-base font-medium text-[#6B7280]">{t('Загрузка туров')}</p>
                  {streamTickets.length > 0 && (
                    <p className="mt-4 text-sm text-[#6B7280]">
                      {streamTickets.length} {t('тур загружен')}
                    </p>
                  )}
                </div>
              ) : streamError ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[14px] bg-[#FAFBFC] px-6 text-center">
                  <p className="text-xl font-semibold text-[#121212]">
                    {t('Не удалось загрузить туры')}
                  </p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    {streamError}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-6 rounded-[12px] bg-[#1A73E8] px-6 py-2 text-white"
                  >
                    {t('Повторить')}
                  </Button>
                </div>
              ) : (
                <>
        
                  {streamTickets.length > 0 ? (
                   
                    <div className="flex flex-col gap-6">
                    {streamTickets.map((item: any, itemIndex: number) => (
                    
                      <TourItem key={`${item.id}-${itemIndex}`} data={item} />
                    ))}
                    </div>
                  ) : (
                    <div className="mt-10 flex h-screen flex-col items-center justify-center">
                      <p className="text-2xl font-semibold text-[#121212]">
                        {t('Не найдено')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {streamTotalPages > 1 && (
            <div className="mt-10 flex w-full items-end justify-end">
             
              <Pagination className="flex justify-end">
                <PaginationContent>
                  <Button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#ECF2FF] hover:bg-[#ECF2FF]"
                  >
                    <ChevronLeft color="#084FE3" />
                  </Button>

                  {Array.from({ length: streamTotalPages }).map(
                    (_, i) => {
                      const page = i + 1;

                      if (
                        page === 1 ||
                        page === streamTotalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              href={`/selectour-test?page=${page}`}
                              className={clsx(
                                'flex h-10 w-10 items-center justify-center rounded-full',
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
                    disabled={currentPage === streamTotalPages}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#ECF2FF] hover:bg-[#ECF2FF]"
                  >
                    <ChevronRight color="#084FE3" />
                  </Button>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// let es = null;

  // const openBtn = document.getElementById('open');
  // const closeBtn = document.getElementById('close');
  // const events = document.getElementById('events');

  // let startTime = null;
  // let firstMessageReceived = false;

  // openBtn.addEventListener('click', () => {

  //   if (es) return;

  //   firstMessageReceived = false;
  //   startTime = performance.now();

  //   es = new EventSource(
  //     'http://localhost:8088/stream-samo/tickets?page=2&page_size=10&adults=3&children=0&operator=&departure=80&destination=155&hotel_amenity=&hotel_id=&town=&hotel_type=&cheapest'
  //   );

  //   es.onopen = () => {
  //     openBtn.disabled = true;
  //     closeBtn.disabled = false;

  //     append('connected');
  //     console.log('SSE connected');
  //   };

  //   const allTickets = [];
  //   es.onmessage = (e) => {

  //     // FIRST DATA TIME
  //     if (!firstMessageReceived) {

  //       firstMessageReceived = true;

  //       const firstChunkMs = performance.now() - startTime;

  //       console.log(
  //         'First data received in:',
  //         firstChunkMs.toFixed(2),
  //         'ms'
  //       );
  //     }

  //     try {
  //       const obj = JSON.parse(e.data);
  //       if (obj.end && obj?.from_cache == false) {
  //         console.log("Final payload received:", obj);
  //         // Bu yerda total, total_pages, total_items ishlatish mumkin
  //         return; // ❌ allTickets.push qilmaymiz
  //       }
  //       console.log('Received data chunk:', obj);
  //      if (obj.prices?.length) {

  //           allTickets.push(...obj.prices);

  //           allTickets.sort(
  //               (a, b) => a.price_full - b.price_full
  //           );

  //           renderAllTickets();
  //           }
  //       function renderAllTickets() {

  //               const container = document.getElementById('cards');

  //               container.innerHTML = '';

  //               allTickets.forEach(ticket => {

  //                   const photo =
  //                   ticket.hotel_photo ||
  //                   ticket.ticket_images ||
  //                   'https://via.placeholder.com/400x250';

  //                   container.innerHTML += `
  //                   <div class="card">
  //                       <img src="${photo}">
  //                       <div class="card-body">
  //                       <div class="card-title">${ticket.title}</div>
  //                       <div class="card-price">${ticket.price} mln</div>
  //                       <div>${ticket.hotel_info}</div>
  //                        <div class="card-nights">
  //                         🛫  ${ticket.departure_date} 
  //                       </div>

  //                       <div>${ticket.nights} nights</div>
  //                       </div>
  //                   </div>
  //                   `;
  //               });
  //               }    

  //     } catch (err) {
  //       console.error('SSE parse error', err);
  //     }
  //   };

  //   es.onerror = (err) => {

  //     append('error or closed');

  //     console.error('SSE error', err);

  //     es.close();
  //     es = null;

  //     openBtn.disabled = false;
  //     closeBtn.disabled = true;
  //   };
  // });

  // closeBtn.addEventListener('click', () => {

  //   if (!es) return;

  //   es.close();
  //   es = null;

  //   append('closed by client');

  //   openBtn.disabled = false;
  //   closeBtn.disabled = true;
  // });

  // function append(text) {

  //   const d = document.createElement('div');

  //   d.className = 'evt';

  //   d.textContent = text;

  //   events.appendChild(d);
  // }