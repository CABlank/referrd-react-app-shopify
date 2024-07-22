import React from "react";
import { ButtonElementProps } from "./Types";

export const defaultButtonProps: Partial<ButtonElementProps> = {
  buttonText: "Button",
  buttonLink: "#",
  buttonBackgroundColor: "#ffffff",
  buttonTextColor: "#000000",
  buttonBorderColor: "#555555",
  buttonBorderWidth: 1,
  buttonBorderRadius: 8,
  paddingTop: "4px",
  paddingRight: "16px",
  paddingBottom: "4px",
  paddingLeft: "16px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  fontFamily: "Arial",
  fontSize: "14",
  textTransform: "none",
  fontWeight: "normal",
  letterSpacing: "normal",
  lineHeight: "normal",
  hoverBackgroundColor: "#ffffff",
  hoverTextColor: "#000000",
  hoverBorderColor: "#555555",
};

const ButtonElement: React.FC<ButtonElementProps> = ({
  buttonText,
  buttonLink,
  buttonAlign = "center",
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
  };

  const hoverStyles = {
    backgroundColor: hoverBackgroundColor,
    color: hoverTextColor,
    borderColor: hoverBorderColor,
  };

  return (
    <a
      href={buttonLink}
      style={inlineStyles}
      onMouseOver={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseOut={(e) => {
        Object.assign(e.currentTarget.style, inlineStyles);
      }}
    >
      {buttonText}
    </a>
  );
};

export default ButtonElement;
