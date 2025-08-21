import React from "react";
import { ShoppingBag } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  customerName,
  totalAmount,
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
      title="Hapus Order"
      message={`Apakah Anda yakin ingin menghapus order #${orderNumber} dari ${customerName} dengan total ${formatCurrency(
        totalAmount
      )}? Tindakan ini tidak dapat dibatalkan.`}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<ShoppingBag className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteOrderModal;
