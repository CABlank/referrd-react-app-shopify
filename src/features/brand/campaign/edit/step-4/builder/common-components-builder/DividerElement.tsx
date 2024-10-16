import React from "react";
import { DividerElementProps } from "./Types";

export const defaultDividerProps: Partial<DividerElementProps> = {
  color: "#000000",
  height: 15,
  width: "100%",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

const DividerElement: React.FC<DividerElementProps> = (props) => {
  const { color, height, width, marginTop, marginRight, marginBottom, marginLeft } = {
    ...defaultDividerProps,
    ...props,
  };

  const inlineStyles = {
    backgroundColor: color,
    width,
    height: `${height}px`,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };

  return <div style={inlineStyles}></div>;
};

export default DividerElement;
