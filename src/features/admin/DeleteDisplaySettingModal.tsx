import React from "react";
import { Settings } from "lucide-react";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

interface DeleteDisplaySettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  settingName: string;
  settingValue: string;
}

const DeleteDisplaySettingModal: React.FC<DeleteDisplaySettingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  settingName,
  settingValue,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Pengaturan Tampilan"
      message={`Apakah Anda yakin ingin menghapus pengaturan "${settingName}" dengan nilai "${settingValue}"? Tindakan ini tidak dapat dibatalkan.`}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<Settings className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteDisplaySettingModal;
