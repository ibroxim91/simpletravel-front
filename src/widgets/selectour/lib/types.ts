export interface TickectAll {
  status: true;
  data: {
    links: {
      previous: string;
      next: string;
    };
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: {
      tickets: TickectAllResults[];
      min_price: number;
      max_price: number;
      hotel_amenities: string[];
      hotel_features_by_type: {
        type: string;
        features: string[];
      }[];
      hotel_types: string[];
      hotels?: {
        id: number;
        name: string;
        meal_plan: string;
        rating: number | string;
      }[];
      top_destinations: {
        destination: string;
      }[];
      top_duration: {
        duration: number;
      }[];
    };
  };
}

export interface TickectAllResults {
  id: number;
  title: string;
  slug: string;
  price: number;
  departure_time: string;
  departure: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
  passenger_count: number;
  rating: number;
  duration_days: number;
  destination: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
  ticket_images: string;
  ticket_amenities: { name: string }[];
  badge: { id: number; name: string; color: string }[];
  visa_required: boolean;
  is_liked: boolean;
  ticket_hotel: {
    id: number;
    name: string;
    meal_plan: string;
    rating: number;
  }[];
}

export interface TickectAllFilter {
  departure?: string;
  featured_tickets?: boolean;
  departure_date?: string;
  departure_time?: string;
  town?: string;
  destination?: string;
  hotel_id?: string;
  operator?: string;
  dateTo?: string;
  dateFrom?: string;
  hotel_feature?: string[];
  duration_days?: string;
  rating?: number;
  hotel_rating?: string;
  hotel_type?: string;
  max_price?: number;
  hotel_amenity?: string;
  meal_plan?: string;
  min_price?: number;
  most_expensive?: boolean;
  max_departure_date?: string;
  min_departure_date?: string;
  adults?: number;
  children?: number;
  passenger_count?: number;
  page: number;
  page_size: number;
  ticket_amenities?: string;
  title?: string;
  visa_required?: boolean | string;
  cheapest?: boolean;
}

export interface HotelMealPlan {
  status: boolean;
  data: {
    id: number;
    name: string;
  }[];
}

type Departure = {
  id: number
  name: string
  country: string
}

type DestinationCountry = {
  id: number
  name: string
}

type Destination = {
  id: number
  name: string
  country: DestinationCountry
}

type TicketHotel = {
  id: number
  name: string
  meal_plan: string
  rating: number
}

type TicketIncludedService = {
  image: string
  title: string
  desc: string
}

type TicketHotelMeal = {
  image: string
  name: string
  desc: string
}

type Tariff = {
  name: string
}

type Transport = {
  id: number
  name: string
}

export type Tour = {
  tour_operator_id: string
  id: number
  title: string
  slug: string
  nights: number
  price: string
  price_full: number
  operator: string
  departure_id: number
  destination_id: number
  country_id: number
  departure_time: string
  hotel_photo: string
  currency: string
  hotelAvailability: string
  hotel_photo_count: number
  departure: Departure
  passenger_count: number
  rating: number
  duration_days: number
  destination: Destination
  ticket_images: string
  ticket_amenities: any[] // agar structure bo'lsa alohida type qilsa bo'ladi
  badge: any[]
  visa_required: boolean
  from_cache: boolean
  is_liked: boolean
  ticket_hotel: TicketHotel[]
  departure_date: string
  room_type: string
  place: string
  freight_external: string
  travel_time: string
  languages: string
  min_person: number
  max_person: number
  image_banner: string
  hotel_info: string
  hotel_meals: string
  allow_comment: boolean
  bron: boolean
  ticket_included_services: TicketIncludedService[]
  ticket_itinerary: any[]
  ticket_hotel_meals: TicketHotelMeal[]
  travel_agency_id: string
  ticket_comments: any[]
  tariff: Tariff[]
  transports: Transport[]
  extra_service: any[]
  paid_extra_service: any[]
}
