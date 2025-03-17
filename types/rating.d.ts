export type PersonalRating = {
  _id: string;
  id: string;
  asav_student_status: string;
  course_number: number;
  created_at: string;
  credits: number;
  date: string;
  edu_form: string;
  edu_level: string;
  email: string;
  filial: string;
  grade_mid: string;
  grade_min: string;
  group_id: string;
  group_name: string;
  index: number;
  percentile: string;
  program_id: string;
  program_name: string;
  student_asav_id: string;
  title_en: string;
  title_ru: string;
  total: number;
  type: string;
  updated_at: string;
  gpa: string;
};

export type RatingList = RatingListItem[];

export type RatingListItem = {
  title: string;
  id: string;
  type: string;
  retake: string;
  year: string;
  module: string;
  date: string;
};

export interface Rating {
  title: string;
  course_number: number;
  group_id: string;
  type: string;
  date: string;
  items: RatingItem[];
}

export interface RatingItem {
  credits: number;
  id: string;
  email: string;
  index: number;
  percentile: string;
  profile: Profile;
  gpa: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  description: string;
  has_phone: boolean;
  type: string;
}
