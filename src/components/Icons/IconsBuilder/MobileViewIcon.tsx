import React from "react";

interface MobileViewIconProps {
  selected: boolean;
}

const MobileViewIcon: React.FC<MobileViewIconProps> = ({ selected }) => {
  return (
    <svg
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0H2C0.897 0 0 0.897 0 2V18C0 19.103 0.897 20 2 20H12C13.103 20 14 19.103 14 18V2C14 0.897 13.103 0 12 0ZM2 14.999V3H12L12.002 14.999H2Z"
        fill={selected ? "#10AD1B" : "#A8A8A8"}
      />
    </svg>
  );
};

export default MobileViewIcon;
