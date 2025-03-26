import type { SearchType } from './search';

export type PersonEntity = {
  type: SearchType;
  id: string;
  full_name: string;
  description: string;
  has_phone: boolean;
  avatar_url?: string;
  birth_date?: string;
  lk_roles?: [];
};
