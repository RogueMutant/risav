import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface BackProps {
  position: "static" | "relative" | "absolute" | "fixed" | "sticky";
}

const Back: React.FC<BackProps> = ({ position }) => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "1em",
          borderRadius: "6px",
          border: "none",
          marginLeft: "0.5em",
          position: position,
          left: "0",
          top: "30px",
          backgroundColor: "#007bff",
          cursor: "pointer",
        }}
      >
        <BsArrowLeft />
      </button>
    </div>
  );
};

export default Back;
