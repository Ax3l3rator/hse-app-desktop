export type Grades = {
  items: GradeItem[];
  available_academic_years: string[];
  selected_academic_year: string;
  selected_program: string;
  available_programs: AvailableProgram[];
  current_academic_year: string;
};

export type GradeItem = {
  student_status_hr_uid: string;
  asav_uid?: string;
  hr_uid: string;
  module_num: string;
  academic_year: string;
  id: string;
  program_id: string;
  discipline: string;
  type_raw: string;
  repass_count: number;
  grade?: Grade;
  date?: string;
  module_name: string;
  period_credits: number;
  credits: number;
  entire_hours: number;
  lecturer?: string;
  aud_hours: number;
};

export type Grade = {
  ten_point_scale?: number;
  five_point_scale?: number;
  pass: boolean;
};

export type AvailableProgram = {
  id: string;
  name: string;
  description: string;
  kud_date: string;
  kud: number;
};
