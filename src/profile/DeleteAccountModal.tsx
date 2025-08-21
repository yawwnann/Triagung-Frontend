import React from "react";
import { UserX, AlertTriangle } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  email,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Akun"
      message={`Apakah Anda yakin ingin menghapus akun ${email}? Tindakan ini akan menghapus semua data Anda secara permanen dan tidak dapat dibatalkan.`}
      type="danger"
      confirmText="Ya, Hapus Akun"
      cancelText="Batal"
      icon={<UserX className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteAccountModal;
