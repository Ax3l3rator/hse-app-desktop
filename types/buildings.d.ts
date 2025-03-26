export interface BuildingGrouped {
  campus: string;
  near: boolean;
  location: Location;
  buildings: Building[];
}

export interface Location {
  type: string;
  coordinates: number[];
}

export interface Building {
  id: string;
  address: string;
  campus: string;
  distance: number;
  location: Location2;
  name: string;
  cafes?: Cafe[];
  libraries: Library[];
  libraries_v3: LibrariesV3[];
}

export interface Location2 {
  type: string;
  coordinates: number[];
}

export interface Cafe {
  cafe_id: string;
  cafe_name: string;
  opening_hours: OpeningHour[];
  address: string;
  coordinates: Coordinates;
  has_menu: boolean;
  photos?: string[];
  description: string;
  navigation?: Navigation;
}

export interface OpeningHour {
  day_of_week: string;
  is_open: boolean;
  start_time?: string;
  end_time?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Navigation {
  room: number;
  floor: number;
}

export interface Library {
  _id: string;
  name: string;
  offices: Office[];
  building_id: string;
  building_source: string;
  index: number;
  building: Building2;
  address_hint?: string;
}

export interface Office {
  name: string;
  phone_numbers: string[];
  address_hint: any;
  rules: Rule[];
}

export interface Rule {
  name?: string;
  schedule: Schedule;
}

export interface Schedule {
  _id: string;
  sanitary_day?: string;
  open_periods: OpenPeriod[];
  close_periods: any[];
  open_now: boolean;
}

export interface OpenPeriod {
  day: number;
  time: string;
}

export interface Building2 {
  id: number;
  campus: string;
  name: string;
  address: string;
  coordinates: Coordinates2;
}

export interface Coordinates2 {
  lat: number;
  lng: number;
}

export interface LibrariesV3 {
  _id: string;
  name: string;
  building_id: string;
  building_source: string;
  offices: Office2[];
  index: number;
  building: Building3;
  address_hint?: string;
}

export interface Office2 {
  name: string;
  rules: Rule2[];
  phone_numbers: string[];
}

export interface Rule2 {
  schedule: Schedule2;
  name?: string;
}

export interface Schedule2 {
  opening_hours: OpeningHour2[];
  sanitary_day?: string;
}

export interface OpeningHour2 {
  day_of_week: string;
  is_open: boolean;
  start_time?: string;
  end_time?: string;
}

export interface Building3 {
  _id: string;
  id: string;
  name: string;
  address: string;
  campus: string;
  location: Location3;
}

export interface Location3 {
  type: string;
  coordinates: number[];
  _id: string;
}
