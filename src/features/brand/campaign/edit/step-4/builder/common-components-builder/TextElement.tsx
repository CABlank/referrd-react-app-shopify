import React from "react";
import { TextElementProps } from "./Types";

export const defaultTextProps: Partial<TextElementProps> = {
  text: "Refer friends and get exclusive discounts!",
  fontFamily: "Arial",
  fontSize: "16",
  textColor: "#FFFFFF",
  textTransform: "none",
  fontWeight: "normal",
  letterSpacing: "normal",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

const TextElement: React.FC<TextElementProps> = (props) => {
  const {
    text,
    fontFamily,
    fontSize,
    textColor,
    textTransform,
    fontWeight,
    letterSpacing,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  } = { ...defaultTextProps, ...props };

  const inlineStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
    textTransform,
    fontWeight,
    letterSpacing,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    display: "flex",
    alignItems: "center",
    height: "100%",
  };

  return <div style={inlineStyles}>{text}</div>;
};

export default TextElement;
