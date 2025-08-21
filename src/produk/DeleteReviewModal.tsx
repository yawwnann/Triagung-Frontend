import React from "react";
import { MessageSquare, X } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface DeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewText: string;
}

const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reviewText,
}) => {
  const truncatedText =
    reviewText.length > 50 ? `${reviewText.substring(0, 50)}...` : reviewText;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Review"
      message={`Apakah Anda yakin ingin menghapus review "${truncatedText}"? Tindakan ini tidak dapat dibatalkan.`}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<MessageSquare className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteReviewModal;
