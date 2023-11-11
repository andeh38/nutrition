import React, { useEffect, useCallback } from "react";
import Visible from "./Visible";
import { MdClose } from "react-icons/md";

interface propsInterface {
  setIsOpen: (bool: boolean) => void;
  isOpen: boolean;
  children: React.ReactNode;
  data?: object;
  dismissible?: boolean;
  callback?: () => void;
}

export const Modal = ({
  setIsOpen,
  isOpen,
  data,
  dismissible = true,
  //callback,
  children,
}: propsInterface) => {
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [data]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return (
    <Visible when={isOpen}>
      <>
        <div className="dark-curtain" onClick={onClose} />
        <div className="centered">
          <div className="modal">
            <Visible when={dismissible}>
              <div className="modalHeader">
                <button className="closeBtn" onClick={onClose}>
                  <MdClose />
                </button>
              </div>
            </Visible>
            <div className="dialog-content">{children}</div>
          </div>
        </div>
      </>
    </Visible>
  );
};

export const ModalActions = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return <div className={`modal-actions ${className}`}>{children}</div>
};
