import React, { useState, useRef } from "react";
import { InputElementProps } from "./Types";
import NameIcon from "../../../../../../../components/icons/icons-builder/NameIcon";
import EmailIcon from "../../../../../../../components/icons/icons-builder/EmailIcon";
import MobileIcon from "../../../../../../../components/icons/icons-builder/MobileIcon";

const InputElement: React.FC<
  InputElementProps & {
    error?: boolean;
    view: "desktop" | "mobile";
    onExpand?: (id: string) => void;
    expandedId?: string;
  }
> = ({
  type,
  value,
  textcolor,
  bordercolor,
  borderwidth,
  borderradius,
  onChange,
  error,
  view,
  placeholder,
  onExpand,
  expandedId,
  id,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isExpanded = expandedId === id;

  let icon;
  if (id.includes("text")) {
    icon = <NameIcon color={bordercolor} />;
  } else if (id.includes("email")) {
    icon = <EmailIcon color={bordercolor} />;
  } else if (id.includes("tel")) {
    icon = <MobileIcon color={bordercolor} />;
  }

  const commonStyles = {
    borderColor: bordercolor || "#000000",
    color: textcolor || "#000000",
    backgroundColor: "transparent",
    borderStyle: "solid",
    marginLeft: "5px",
    marginRight: "5px",
    width: "100%",
    padding: "5px",
    fontWeight: "500", // Set font weight to medium (500)
  };

  const collapsedStyles = {
    ...commonStyles,
    borderWidth: `${borderwidth}px` || "1px",
    borderRadius: `${borderradius}px` || "0px",
  };

  const expandedStyles = {
    ...commonStyles,
    borderWidth: `${borderwidth}px` || "1px", // Ensure correct border width when expanded
    borderRadius: `${borderradius}px` || "0px", // Ensure correct border radius when expanded
  };

  const containerStyles = {
    width: isExpanded ? "120px" : "38px",
    backgroundColor: isExpanded ? "transparent" : "inherit",
    padding: isExpanded ? "0px" : "10px",
    border: isExpanded ? "none" : `${borderwidth}px solid ${bordercolor || "#000000"}`,
    borderRadius: `${borderradius}px` || "0px", // Apply border radius to the container
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "38px", // Ensure consistent height
  };

  const placeholderStyleId = `input-placeholder-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = () => {
    onExpand && onExpand(id);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (view === "mobile") {
      onExpand && onExpand("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <>
      <style>
        {`
          .${placeholderStyleId}::placeholder {
            color: ${textcolor || "#000000"};
            font-weight: 500; // Set font weight to medium for placeholder
          }
          .input-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 0;
            flex-shrink: 0;
            height: 38px;
            position: relative;
            gap: 8px;
            margin: 4px;
            padding: 0 12px;
            border-radius: 8px;
          }
          .input-container.error {
            border-color: red;
          }
          .icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        `}
      </style>
      {view === "mobile" ? (
        <div
          className={`input-container ${error ? "error" : ""}`}
          style={containerStyles}
          onClick={!isExpanded ? handleFocus : undefined}
        >
          {!isExpanded && icon && <div className="icon-container">{icon}</div>}
          <input
            required
            ref={inputRef}
            type={type}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            style={{
              ...(isExpanded ? expandedStyles : collapsedStyles),
              display: isExpanded ? "block" : "none",
            }}
            className={placeholderStyleId}
            {...props}
          />
        </div>
      ) : (
        <input
          required
          ref={inputRef}
          type={type}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            ...commonStyles,
            borderWidth: `${borderwidth}px`,
            borderRadius: `${borderradius}px`,
            width: "120px",
          }}
          className={placeholderStyleId}
          {...props}
        />
      )}
    </>
  );
};

export default InputElement;
