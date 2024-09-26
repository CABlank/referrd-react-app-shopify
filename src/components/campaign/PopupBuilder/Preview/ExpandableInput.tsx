import React from "react";

interface ExpandableInputProps {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isExpanded: boolean;
  onFocus: () => void;
  onBlur: () => void;
  style?: React.CSSProperties;
  name: string;
}

const ExpandableInput: React.FC<ExpandableInputProps> = ({
  name,
  type,
  value,
  placeholder,
  onChange,
  isExpanded,
  onFocus,
  onBlur,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "40px",
        position: "relative",
        gap: "10px",
        padding: "8px",
        borderRadius: "10px",
        backgroundColor: "white",
        border: `0.5px solid ${isExpanded ? "blue" : "rgba(0, 0, 0, 0.3)"}`,
        width: "100%",
        transition: "all 0.2s",
        boxShadow: "none",
        outline: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          flexGrow: 1,
          fontSize: "14px",
          textAlign: "left",
          color: "black",
          padding: "8px",
          outline: "none",
          border: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
        required
      />
    </div>
  );
};

export default ExpandableInput;
