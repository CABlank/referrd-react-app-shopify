import React from "react";
import { ButtonElementProps } from "./Types";

export const defaultButtonProps: Partial<ButtonElementProps> = {
  buttonText: "Join Us",
  buttonLink: "#",
  buttonBackgroundColor: "#ffffff",
  buttonTextColor: "#000000",
  buttonBorderColor: "#555555",
  buttonBorderWidth: 1,
  buttonBorderRadius: 12,
  paddingTop: "8px",
  paddingRight: "24px",
  paddingBottom: "8px",
  paddingLeft: "24px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  fontFamily: "Arial",
  fontSize: "14",
  textTransform: "none",
  fontWeight: "bold",
  letterSpacing: "normal",
  lineHeight: "normal",
  hoverBackgroundColor: "#ffffff",
  hoverTextColor: "#000000",
  hoverBorderColor: "#555555",
  width: "100%",
  alignSelf: "center",
};

const ButtonElement: React.FC<ButtonElementProps> = ({
  buttonText,
  buttonLink,
  buttonAlign = "center",
  onClick,
  id,
  ...props
}) => {
  const {
    buttonBackgroundColor,
    buttonTextColor,
    buttonBorderColor,
    buttonBorderWidth,
    buttonBorderRadius,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    fontFamily,
    fontSize,
    textTransform,
    fontWeight,
    letterSpacing,
    lineHeight,
    hoverBackgroundColor,
    hoverTextColor,
    hoverBorderColor,
  } = { ...defaultButtonProps, ...props };

  const inlineStyles = {
    display: "inline-block",
    backgroundColor: buttonBackgroundColor,
    color: buttonTextColor,
    border: `${buttonBorderWidth}px solid ${buttonBorderColor}`,
    borderRadius: `${buttonBorderRadius}px`,
    padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
    margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`,
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    textTransform: textTransform,
    fontWeight: fontWeight,
    letterSpacing: letterSpacing,
    lineHeight: lineHeight,
    textDecoration: "none",
    textAlign: buttonAlign as "left" | "center" | "right",
    cursor: "pointer",
  };

  const hoverStyles = {
    backgroundColor: hoverBackgroundColor,
    color: hoverTextColor,
    borderColor: hoverBorderColor,
  };

  return (
    <button
      id={id} // Assign the realButtonId here
      type="button"
      style={inlineStyles}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        } else {
        }
      }}
      onMouseOver={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseOut={(e) => {
        Object.assign(e.currentTarget.style, inlineStyles);
      }}
    >
      {buttonText}
    </button>
  );
};

export default ButtonElement;
