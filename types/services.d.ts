export type ServiceList = ServiceListItem[];

export interface ServiceListItem {
  id: number;
  category?: string;
  icon: string;
  name: string;
  description?: string;
  url?: string;
}
