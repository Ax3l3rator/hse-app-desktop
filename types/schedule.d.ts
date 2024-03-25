export type RawScheduleElement = {
  id: string;
  building: string;
  type: string;
  stream: string;
  auditorium_id: number;
  auditorium: string;
  city: string;
  date_start: string;
  date_end: string;
  created_at: string;
  updated_at: string;
  importance_level: number;
  building_id: number;
  location: Location;
  discipline: string;
  discipline_link: string;
  lesson_number_start: number;
  lesson_number_end: number;
  duration: number[];
  lecturer_emails: string[];
  lecturer_profiles: LecturerProfile[];
  kindOfWork: string;
  hash: string;
};

export type LecturerProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  description: string;
  has_phone: boolean;
  type: string;
};

export type Location = {
  type: string;
  coordinates: number[];
};

export type ScheduleElement = {
  name: string;
  teacher: string | undefined;
  pair: number;
  place: string;
  type: string;
};

export type ScheduleDay = {
  date: string;
  lessons: { [k: string]: ScheduleElement[] };
};
