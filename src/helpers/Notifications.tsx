import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationProps = {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
};

export const Notification: React.FC<NotificationProps> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 seconds auto close

      return () => clearTimeout(timer); // cleanup on unmount or message change
    }
  }, [message, onClose]);

  let bgColor;
  switch (type) {
    case "error":
      bgColor = "bg-red-500";
      break;
    case "success":
      bgColor = "bg-green-500";
      break;
    case "info":
    default:
      bgColor = "bg-blue-500";
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${bgColor} text-white px-4 py-3 rounded fixed top-5 right-5 shadow-lg z-50 cursor-pointer`}
          onClick={onClose}
          role="alert"
          key="notification"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
