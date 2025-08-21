import React from "react";
import { Package } from "lucide-react";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  orderCount: number;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  orderCount,
}) => {
  const message =
    orderCount > 0
      ? `Produk "${productName}" memiliki ${orderCount} pesanan. Menghapus produk ini akan mempengaruhi data pesanan. Apakah Anda yakin ingin melanjutkan?`
      : `Apakah Anda yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat dibatalkan.`;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Produk"
      message={message}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<Package className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteProductModal;
