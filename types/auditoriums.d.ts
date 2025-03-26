export interface AuditoriumsGrouped {
  rooms: Room[];
  building: Building;
}

export interface Room {
  type: string;
  id: string;
  room: string;
  description: string;
  auditorium_type: string;
  auditorium_location: AuditoriumLocation;
  navigation?: Navigation;
  facilities: Facility[];
  auditorium_building?: string;
  full_name: string;
  images: any[];
}

export interface AuditoriumLocation {
  type: string;
  coordinates: number[];
}

export interface Navigation {
  room: number;
  floor: number;
}

export interface Facility {
  type: string;
  boolean_value?: boolean;
  string_value?: string;
  caption: string;
}

export interface Building {
  id: string;
  address: string;
  campus: string;
  location: Location;
  name: string;
}

export interface Location {
  type: string;
  coordinates: number[];
}

export interface AuditoriumsResult extends Record<string, Auditorium[]> {}

export interface Auditorium {
  type: string;
  id: string;
  room: string;
  description: string;
  auditorium_type: string;
  auditorium_location: AuditoriumLocation;
  facilities: Facility[];
  auditorium_floor: string;
  full_name: string;
  images: any[];
}
