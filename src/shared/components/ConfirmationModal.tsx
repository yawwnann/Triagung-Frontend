import React from "react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import BaseModal from "./BaseModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText,
  cancelText = "Batal",
  icon,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          iconBg: "bg-red-100",
          confirmBg: "bg-red-600 hover:bg-red-700",
          defaultConfirmText: "Ya, Lanjutkan",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          iconBg: "bg-yellow-100",
          confirmBg: "bg-yellow-600 hover:bg-yellow-700",
          defaultConfirmText: "Ya, Saya Yakin",
        };
      case "info":
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
          confirmBg: "bg-blue-600 hover:bg-blue-700",
          defaultConfirmText: "Ya, Saya Setuju",
        };
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          iconBg: "bg-green-100",
          confirmBg: "bg-green-600 hover:bg-green-700",
          defaultConfirmText: "Ya, Lanjutkan",
        };
    }
  };

  const styles = getTypeStyles();
  const finalConfirmText = confirmText || styles.defaultConfirmText;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center`}
          >
            {icon || styles.icon}
          </div>
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors font-medium ${styles.confirmBg}`}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
