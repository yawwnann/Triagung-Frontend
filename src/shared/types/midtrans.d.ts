/**
 * Interface for the result object from Midtrans Snap.js callbacks.
 * Based on the Midtrans documentation.
 */
export interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface MidtransError {
  status_code: string;
  status_message: string;
}

export interface Snap {
  pay: (
    snapToken: string,
    options?: {
      onSuccess?: (result: MidtransResult) => void;
      onPending?: (result: MidtransResult) => void;
      onError?: (result: MidtransError) => void;
      onClose?: () => void;
    }
  ) => void;
}

declare global {
  interface Window {
    snap?: Snap;
  }
}
