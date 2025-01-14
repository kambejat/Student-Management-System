import React, { ReactNode } from "react";
import { CloseIcon } from "../icon/icons";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  Content: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggleModal, Content }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-75 dark:opacity-50"></div>
          <div className="bg-white dark:bg-gray-900/60 sm:m-32 md:m-4 rounded-sm p-1 relative z-50 w-full max-w-[1300px]">
            <div className="flex justify-end mb-4">
              <button className={`text-red-700 dark:text-white`} onClick={toggleModal}>
                <span><CloseIcon /></span> 
              </button>
            </div>
            <div className="w-full">{Content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
