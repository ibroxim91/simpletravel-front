import { create } from 'zustand';

interface FilterState {
  durationDays:
    | {
        duration: number;
      }[]
    | null;
  setDurationDays: (
    durationDays: {
      duration: number;
    }[],
  ) => void;
  destinations:
    | {
        destination: string;
      }[]
    | null;
  setDestinations: (
    destinations: {
      destination: string;
    }[],
  ) => void;

  hotel_type: string[];
  setHotelType: (hotel_type: string[]) => void;
  hotel_amenities: string[];
  setHotelAmenities: (hotel_amenities: string[]) => void;

  hotel_features_by_type: {
    type: string;
    features: string[];
  }[];
  setFeatures: (
    hotel_features_by_type: {
      type: string;
      features: string[];
    }[],
  ) => void;
}

export const useFilterTickectsStore = create<FilterState>((set) => ({
  durationDays: null,
  setDurationDays: (durationDays) => set({ durationDays }),
  destinations: null,
  setDestinations: (destinations) => set({ destinations }),
  setHotelType: (hotel_type) => set({ hotel_type }),
  hotel_type: [''],
  hotel_amenities: [''],
  setHotelAmenities: (hotel_amenities) => set({ hotel_amenities }),
  hotel_features_by_type: [
    {
      type: '',
      features: [''],
    },
  ],
  setFeatures: (hotel_features_by_type) => set({ hotel_features_by_type }),
}));
