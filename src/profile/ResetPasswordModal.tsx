import React from "react";
import { Key } from "lucide-react";
import ConfirmationModal from "../common/components/ConfirmationModal";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Reset Password"
      message="Apakah Anda yakin ingin mereset password? Password baru akan dikirim ke email Anda. Pastikan email Anda aktif dan dapat diakses."
      type="warning"
      confirmText="Ya, Reset Password"
      cancelText="Batal"
      icon={<Key className="w-6 h-6 text-yellow-600" />}
    />
  );
};

export default ResetPasswordModal;
