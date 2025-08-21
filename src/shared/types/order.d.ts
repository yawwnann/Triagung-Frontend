/**
 * Represents a single item within an order.
 */
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
  product: {
    gambar: string;
  };
}

/**
 * Represents the shipping address for an order.
 */
export interface OrderAddress {
  id: number;
  recipient_name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
}

/**
 * Represents the payment details for an order.
 */
export interface PaymentDetails {
  payment_type?: string;
  bank_name?: string;
  account_number?: string;
}

/**
 * Represents a complete order.
 */
export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  order_number: string;
  total_amount: string;
  shipping_cost: string;
  tax: string;
  discount: string;
  grand_total: string;
  status: string;
  payment_status: "paid" | "unpaid" | "pending" | "expired" | "cancelled";
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  payment_token: string | null;
  items: OrderItem[];
  shipping_address: OrderAddress;
  payment_details: PaymentDetails;
}
