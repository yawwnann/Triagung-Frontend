import React from "react";
import { MessageSquare } from "lucide-react";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

interface DeleteReviewAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewText: string;
  userName: string;
  productName: string;
}

const DeleteReviewAdminModal: React.FC<DeleteReviewAdminModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reviewText,
  userName,
  productName,
}) => {
  const truncatedText =
    reviewText.length > 50 ? `${reviewText.substring(0, 50)}...` : reviewText;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Review"
      message={`Apakah Anda yakin ingin menghapus review dari ${userName} untuk produk "${productName}": "${truncatedText}"? Tindakan ini tidak dapat dibatalkan.`}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<MessageSquare className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteReviewAdminModal;
