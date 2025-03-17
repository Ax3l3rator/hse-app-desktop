export type BuildingCafes = BuildingCafe[];

export type BuildingCafe = {
  cafes: Cafe[];
  campus_id: string;
  campus_name: string;
  coordinates: Coordinates;
};

export type Cafe = {
  cafe_id: string;
  cafe_name: string;
  opening_hours: OpeningHour[];
  address: string;
  coordinates: Coordinates;
  has_menu: boolean;
  photo?: string;
  photos?: string[];
  description: string;
  banner?: string;
  navigation?: Navigation;
};

export type OpeningHour = {
  day_of_week: string;
  is_open: boolean;
  start_time?: string;
  end_time?: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Navigation = {
  room: number;
  floor: number;
};

export type CafeMenu = {
  cafe_id: string;
  current_day: string;
  available_days: string[];
  notify: string;
  sections: Section[];
};

export type CafeMenuSection = {
  section_name: string;
  price?: number;
  section: string;
  items: CafeMenuSectionItem[];
};

export type CafeMenuSectionItem = {
  item_name: string;
  item_name_opt: string;
  item_id: string;
  props: CafeMenuSectionItemProp[];
  composition?: string;
  chips?: string[];
  section: string;
  price?: number;
};

export type CafeMenuSectionItemProp = {
  type: string;
  value: string;
  label: string;
};
