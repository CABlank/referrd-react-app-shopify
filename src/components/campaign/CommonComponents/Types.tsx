export interface TextElementProps {
  id: string;
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  fontWeight: "normal" | "bold" | "bolder" | "lighter";
  letterSpacing: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
}

export interface ButtonElementProps {
  id: string;
  type: "button";
  buttonText: string;
  buttonLink: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  buttonBorderWidth: number;
  buttonBorderRadius: number;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  fontFamily: string;
  fontSize: string;
  textAlign: "left" | "center" | "right";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  fontWeight: "normal" | "bold" | "bolder" | "lighter";
  letterSpacing: string;
  lineHeight: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  buttonAlign: "flex-start" | "center" | "flex-end";
}

export interface ImageElementProps {
  imageUrl?: string;
  id: string;
  type: "image";
  imageWidth?: string;
  imageHeight?: string;
  borderRadius?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  centerImage?: boolean;
}

export interface DividerElementProps {
  type: "divider";
  id: string;
  color?: string;
  height?: number;
  width?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

export type ElementProps =
  | TextElementProps
  | ButtonElementProps
  | DividerElementProps
  | ImageElementProps;

export interface FormFieldProps {
  label: string;
  name: string;
  type:
    | "text"
    | "select"
    | "color"
    | "padding"
    | "margin"
    | "number"
    | "checkbox"
    | "percentage"
    | string;
  value: string | number | { [key: string]: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: string[];
  style?: React.CSSProperties;
  onBatchChange?: (updatedValues: { [key: string]: string }) => void;
}

export const ItemTypes = {
  TEXT_ELEMENT: "textElement",
  BUTTON_ELEMENT: "buttonElement",
  ELEMENT: "element",
  IMAGE: "imageElement",
  DIVIDER_ELEMENT: "dividerElement",
};

export interface DragItem {
  type: string;
  id: string;
  index: number;
}

export interface PopupConfig {
  backgroundColor: string;
  height: string;
  borderWidth: string;
  ImagePosition: "None" | "Left" | "Right";
  width: string;
}

export interface TopBarConfig {
  backgroundColor: string;
  height: string;
}
