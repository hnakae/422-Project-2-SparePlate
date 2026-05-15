export interface Category {
  color: string;
  ink: string;
  label: string;
  emoji: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  hood: string;
  verified: boolean;
  rating: number;
}

export interface Listing {
  id: string;
  biz: string;
  title: string;
  category: string;
  servings: number;
  weight: string;
  window: { start: string; end: string };
  diet: string[];
  notes: string;
  claims: number;
  max: number;
  distance: number;
  urgent?: boolean;
  full?: boolean;
}

export interface Reservation {
  id: string;
  listing: string;
  who: string;
  when: string;
  status: 'reserved' | 'picked-up';
  code?: string;
}

export interface MapPin {
  id: string;
  x: number;
  y: number;
}

export interface Impact {
  meals_this_month: number;
  lb_diverted: number;
  co2_avoided_lb: number;
  value_recovered: number;
  sparkline: number[];
  streak_days: number;
}

export interface HubDataPoint {
  d: string;
  meals: number;
}

export interface SPData {
  now: Date;
  businesses: Business[];
  listings: Listing[];
  reservations: Reservation[];
  myBiz: string;
  impact: Impact;
  hubSeries: HubDataPoint[];
  mapPins: MapPin[];
  cat: Record<string, Category>;
}

export type WindowKind = 'past' | 'future' | 'urgent' | 'now';

export interface WindowState {
  kind: WindowKind;
  label: string;
}

export interface AppContext {
  data: SPData;
  now: Date;
  listings: Listing[];
  openListing: (id: string) => void;
  claimListing: (id: string) => void;
  addListing: (l: Listing) => void;
  addToast: (msg: string) => void;
}
