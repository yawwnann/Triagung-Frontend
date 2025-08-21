import React from "react";
import { Trash2 } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface DeleteCartItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteCartItemModal: React.FC<DeleteCartItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus dari Keranjang"
      message={`Apakah Anda yakin ingin menghapus "${productName}" dari keranjang belanja?`}
      type="warning"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<Trash2 className="w-6 h-6 text-orange-600" />}
    />
  );
};

export default DeleteCartItemModal;
