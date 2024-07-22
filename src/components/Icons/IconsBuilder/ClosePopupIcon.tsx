import React from "react";

const ClosePopupIcon: React.FC = () => {
  return (
    <div className="bg-black rounded-full p-0.5 flex justify-center items-center w-5 h-5 absolute left-[560px] top-4 z-10 cursor-pointer">
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        preserveAspectRatio="none"
      >
        <path
          d="M12 1.5C6.15 1.5 1.5 6.15 1.5 12C1.5 17.85 6.15 22.5 12 22.5C17.85 22.5 22.5 17.85 22.5 12C22.5 6.15 17.85 1.5 12 1.5ZM16.05 17.25L12 13.2L7.95 17.25L6.75 16.05L10.8 12L6.75 7.95L7.95 6.75L12 10.8L16.05 6.75L17.25 7.95L13.2 12L17.25 16.05L16.05 17.25Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default ClosePopupIcon;
