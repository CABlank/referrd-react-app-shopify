import React from "react";
import { ImageElementProps } from "./Types";

interface ImageElementComponentProps extends ImageElementProps {
  imageUrl: string;
}

const ImageElement: React.FC<ImageElementComponentProps> = ({
  imageUrl,
  imageWidth = "100%",
  imageHeight = "100%",
  borderRadius = "0",
  objectFit = "cover",
  centerImage = false,
  ...props
}) => {
  const processedImageWidth = imageWidth.includes("%")
    ? imageWidth
    : `${imageWidth}%`;
  const processedImageHeight = imageHeight.includes("%")
    ? imageHeight
    : `${imageHeight}%`;

  const style = {
    width: processedImageWidth,
    height: processedImageHeight,
    borderRadius: `${borderRadius}px`,
    objectFit,
    display: centerImage ? "block" : "inline-block",
    margin: centerImage ? "0 auto" : "initial",
  };

  return <img src={imageUrl} alt="Image" style={style} {...props} />;
};

export const defaultImageProps: Partial<ImageElementProps> = {
  imageWidth: "100%",
  imageHeight: "100%",
  borderRadius: "0",
  objectFit: "cover",
  centerImage: false,
};

export default ImageElement;
