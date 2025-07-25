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
    success: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      border: "border-green-200",
      icon: "text-green-100",
      text: "text-white",
      shadow: "shadow-green-500/25",
      hover: "hover:from-green-600 hover:to-green-700",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      border: "border-red-200",
      icon: "text-red-100",
      text: "text-white",
      shadow: "shadow-red-500/25",
      hover: "hover:from-red-600 hover:to-red-700",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      border: "border-blue-200",
      icon: "text-blue-100",
      text: "text-white",
      shadow: "shadow-blue-500/25",
      hover: "hover:from-blue-600 hover:to-blue-700",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      border: "border-yellow-200",
      icon: "text-yellow-100",
      text: "text-white",
      shadow: "shadow-yellow-500/25",
      hover: "hover:from-yellow-600 hover:to-yellow-700",
    },
  };

  const iconMap = {
    success: <Check size={20} className="flex-shrink-0" />,
    error: <X size={20} className="flex-shrink-0" />,
    info: <Info size={20} className="flex-shrink-0" />,
    warning: <AlertTriangle size={20} className="flex-shrink-0" />,
  };

  const currentStyle = notificationStyles[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
          scale: 0.8,
          x: "-50%",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: "-50%",
        }}
        exit={{
          opacity: 0,
          y: -100,
          scale: 0.8,
          x: "-50%",
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`
          fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999]
          px-6 py-4 rounded-2xl shadow-2xl
          border backdrop-blur-sm
          flex items-center justify-center gap-3
          min-w-[320px] max-w-[90vw] sm:max-w-[480px]
          cursor-pointer transition-all duration-300
          ${currentStyle.bg} ${currentStyle.border} ${currentStyle.shadow} ${currentStyle.hover}
        `}
        onClick={onClose}
        style={{
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
        }}
      >
        {/* Icon */}
        <div className={`${currentStyle.icon} flex-shrink-0`}>
          {iconMap[type]}
        </div>

        {/* Message */}
        <span
          className={`${currentStyle.text} font-medium text-sm sm:text-base leading-relaxed flex-1 text-center sm:text-left`}
        >
          {message}
        </span>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`
            flex-shrink-0 p-1.5 rounded-full 
            transition-all duration-200
            hover:bg-white hover:bg-opacity-20
            active:bg-white active:bg-opacity-30
            ${currentStyle.icon}
          `}
        >
          <X size={16} />
        </motion.button>

        {/* Progress Bar */}
        {duration > 0 && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: duration / 1000,
              ease: "linear",
            }}
            className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 rounded-b-2xl"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
