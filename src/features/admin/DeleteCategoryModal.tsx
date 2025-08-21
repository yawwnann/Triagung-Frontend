import React from "react";
import { Folder } from "lucide-react";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  productCount: number;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  productCount,
}) => {
  const message =
    productCount > 0
      ? `Kategori "${categoryName}" memiliki ${productCount} produk. Menghapus kategori ini akan mempengaruhi produk yang terkait. Apakah Anda yakin ingin melanjutkan?`
      : `Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Kategori"
      message={message}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<Folder className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteCategoryModal;
