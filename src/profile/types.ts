export interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  is_default?: boolean;
  notes?: string;
}
