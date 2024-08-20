"use strict";
/*import React from "react";

interface ExpandableInputProps {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isExpanded: boolean;
  onFocus: () => void;
  onBlur: () => void;
  view: "desktop" | "mobile";
  icon?: React.ReactNode; // Make icon prop optional
  error?: boolean; // Add error prop
}

const ExpandableInput: React.FC<ExpandableInputProps> = ({
  type,
  value,
  placeholder,
  onChange,
  isExpanded,
  onFocus,
  onBlur,
  view,
  icon,
  error, // Add error prop
}) => {
  return (
    <div
      className={`flex justify-start items-center flex-grow-0 flex-shrink-0 h-9 relative gap-2 pl-3 pr-6 py-2.5 rounded-lg border ${
        error ? "border-red-500" : "border-white"
      }`}
      style={{
        width: view === "desktop" ? "120px" : isExpanded ? "120px" : "40px",
      }}
      onClick={onFocus}
    >
      {view === "mobile" && !isExpanded && icon && (
        <div className="icon-container">{icon}</div>
      )}
      <input
        type={type}
        value={view === "mobile" && !isExpanded ? "" : value || ""}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={isExpanded || view === "desktop" ? placeholder : ""}
        className="bg-transparent text-white outline-none text-base font-regular placeholder-white"
        style={{ width: "100%" }}
      />
      <style jsx>{`
        .placeholder-white::placeholder {
          color: white;
          opacity: 1;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default ExpandableInput;
*/
