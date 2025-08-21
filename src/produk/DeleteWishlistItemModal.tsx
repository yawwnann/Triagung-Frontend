import React from "react";
import { Heart } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface DeleteWishlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteWishlistItemModal: React.FC<DeleteWishlistItemModalProps> = ({
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
      title="Hapus dari Wishlist"
      message={`Apakah Anda yakin ingin menghapus "${productName}" dari wishlist?`}
      type="warning"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<Heart className="w-6 h-6 text-pink-600" />}
    />
  );
};

export default DeleteWishlistItemModal;
