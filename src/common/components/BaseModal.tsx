import React from "react";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  // Form props
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  showActions?: boolean;
  submitDisabled?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  onSubmit,
  submitText = "Simpan",
  cancelText = "Batal",
  showActions = false,
  submitDisabled = false,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} overflow-hidden max-h-[90vh]`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="p-6">{children}</div>

          {/* Action Buttons */}
          {showActions && (
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={submitDisabled}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitText}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BaseModal;
