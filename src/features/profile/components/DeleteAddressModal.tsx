import React from "react";
import { Trash2 } from "lucide-react";
import ConfirmationModal from "../../common/components/ConfirmationModal";

interface DeleteAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addressName: string;
}

const DeleteAddressModal: React.FC<DeleteAddressModalProps> = ({
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
      title="Hapus Alamat"
      message={`Apakah Anda yakin ingin menghapus alamat "${addressName}"? Tindakan ini tidak dapat dibatalkan.`}
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      icon={<Trash2 className="w-6 h-6 text-red-600" />}
    />
  );
};

export default DeleteAddressModal;
