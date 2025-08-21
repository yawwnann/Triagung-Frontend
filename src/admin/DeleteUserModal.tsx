import React from "react";
import { UserX } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
  orderCount: number;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  orderCount,
}) => {
  const message =
    orderCount > 0
      ? `User "${userName}" (${userEmail}) memiliki ${orderCount} pesanan. Menghapus user ini akan mempengaruhi data pesanan. Apakah Anda yakin ingin melanjutkan?`
      : `Apakah Anda yakin ingin menghapus user "${userName}" (${userEmail})? Tindakan ini akan menghapus semua data user secara permanen.`;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus User"
      message={message}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<UserX className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteUserModal;
