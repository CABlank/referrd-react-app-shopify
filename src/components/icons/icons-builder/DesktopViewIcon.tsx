import React from "react";

interface DesktopViewIconProps {
  selected: boolean;
}

const DesktopViewIcon: React.FC<DesktopViewIconProps> = ({ selected }) => {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 18V17L8 15H2C1.45 15 0.979333 14.8043 0.588 14.413C0.196667 14.0217 0.000666667 13.5507 0 13V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V13C20 13.55 19.8043 14.021 19.413 14.413C19.0217 14.805 18.5507 15.0007 18 15H12L14 17V18H6ZM2 10H18V2H2V10Z"
        fill={selected ? "#10AD1B" : "#A8A8A8"}
      />
    </svg>
  );
};

export default DesktopViewIcon;
