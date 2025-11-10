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
  departure_date: string;
  departure: string;
  passenger_count: number;
  rating: number;
  duration_days: number;
  destination: string;
  ticket_images: string;
  ticket_amenities: { name: string }[];
  badge: { id: number; name: string; color: string }[];
  visa_required: boolean;
  is_liked: boolean;
}

export interface TickectAllFilter {
  departure?: string;
  featured_tickets?: boolean;
  departure_date?: string;
  departure_time?: string;
  destination?: string;
  hotel_name?: string;
  hotel_feature?: string[];
  destinations?: string;
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
  passenger_count?: number;
  page: number;
  page_size: number;
  ticket_amenities?: string;
  title?: string;
  visa_required?: boolean | string;
  cheapest?: boolean;
}
