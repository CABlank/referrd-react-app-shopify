// src/components/Icons/ArrowDropdownIcon.tsx
import React from "react";

interface ArrowDropdownIconProps {
  isOpen: boolean;
  width?: number;
  height?: number;
}

const ArrowDropdownIcon: React.FC<ArrowDropdownIconProps> = ({
  isOpen,
  width = 24,
  height = 24,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transform ${isOpen ? "rotate-180" : ""}`}
      preserveAspectRatio="none"
    >
      <path
        d="M18.75 8.625L12 15.375L5.25 8.625"
        stroke="black"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowDropdownIcon;
