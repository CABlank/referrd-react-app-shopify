interface BaseElementProps {
  id: string;
  type: string;
}

export interface TextElementProps extends BaseElementProps {
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

export interface InputElementProps {
  name: string;
  placeholder: string;
  id: string;
  type: "text" | "email" | "tel" | "password" | "number" | "input"; // Add more if needed  placeholder: string;
  value: string;
  bordercolor?: string;
  textcolor?: string;
  borderradius?: number;
  borderwidth?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ButtonElementProps extends BaseElementProps {
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
  onClick?: () => void;
  isPreloaded?: boolean;
  realButtonId?: string;
  width?: string;
  alignSelf?: string;
}

export interface ImageElementProps extends BaseElementProps {
  type: "image";
  imageUrl?: string;
  imageWidth?: string;
  imageHeight?: string;
  borderRadius?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  centerImage?: boolean;
}

export interface DividerElementProps extends BaseElementProps {
  type: "divider";
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
  | InputElementProps
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
  INPUT_ELEMENT: "inputElement",
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
  width: any;
  backgroundColor: string;
  height: string;
}
