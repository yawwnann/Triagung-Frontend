import React from "react";
import { CreditCard } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface CheckoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalAmount: number;
  itemCount: number;
}

const CheckoutConfirmationModal: React.FC<CheckoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  itemCount,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Konfirmasi Checkout"
      message={`Anda akan melakukan checkout untuk ${itemCount} item dengan total ${formatCurrency(
        totalAmount
      )}. Lanjutkan ke pembayaran?`}
      type="success"
      confirmText="Ya, Lanjutkan"
      cancelText="Batal"
      icon={<CreditCard className="w-6 h-6 text-green-600" />}
    />
  );
};

export default CheckoutConfirmationModal;
