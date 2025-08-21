export interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  regency_id?: string;
  district: string;
  postal_code: string;
  is_default?: boolean;
  notes?: string;
}
