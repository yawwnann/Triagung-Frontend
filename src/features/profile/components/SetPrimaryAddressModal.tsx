import React from "react";
import { Star } from "lucide-react";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";

interface SetPrimaryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addressName: string;
}

const SetPrimaryAddressModal: React.FC<SetPrimaryAddressModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  addressName,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Set Alamat Utama"
      message={`Apakah Anda yakin ingin menjadikan alamat "${addressName}" sebagai alamat utama? Alamat utama akan digunakan sebagai default untuk pengiriman.`}
      type="info"
      confirmText="Ya, Set Utama"
      cancelText="Batal"
      icon={<Star className="w-6 h-6 text-blue-600" />}
    />
  );
};

export default SetPrimaryAddressModal;
