import React, { useState, useEffect } from "react";
import "../styles/index.css";

interface ModalProp {
  str: string;
  //   onOpen: boolean;
}

export const ModalView: React.FC<ModalProp> = ({ str }) => {
  const [isOpen, setIsOpen] = useState(true);

  //   useEffect(() => {
  //     setIsOpen(onOpen);
  //   }, [onOpen]);

  return (
    <div className={`modal ${isOpen ? "modal-header" : ""}`}>
      <div className="modal-header">
        <h2>{str}</h2>
      </div>
    </div>
  );
};
