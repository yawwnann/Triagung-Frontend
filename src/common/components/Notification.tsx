import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, AlertTriangle } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const notificationStyles = {
    success: "bg-green-500 border-green-700",
    error: "bg-red-500 border-red-700",
    info: "bg-blue-500 border-blue-700",
    warning: "bg-yellow-500 border-yellow-700",
  };

  const iconMap = {
    success: <Check size={20} />,
    error: <X size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  return (
    <AnimatePresence>
      <motion.div
        // 2. Kembalikan animasi slide dari atas
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        transition={{ duration: 0.3 }}
        className={`fixed top-32 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-base flex items-center justify-center space-x-3 z-50 border-l-4 ${notificationStyles[type]} cursor-pointer`}
        onClick={onClose}
      >
        {iconMap[type]}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
