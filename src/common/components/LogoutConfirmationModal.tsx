import React from "react";
import { LogOut } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Konfirmasi Logout"
      message="Apakah Anda yakin ingin keluar dari akun? Semua data sesi akan dihapus."
      type="warning"
      confirmText="Ya, Keluar"
      cancelText="Batal"
      icon={<LogOut className="w-6 h-6 text-orange-600" />}
    />
  );
};

export default LogoutConfirmationModal;
