import React from "react";
import { ImageElementProps } from "./Types";
import styled from "styled-components";

const StyledImage = styled.img<Partial<ImageElementProps>>`
  width: ${({ imageWidth }) => imageWidth || "100%"};
  height: ${({ imageHeight }) => imageHeight || "100%"};
  border-radius: ${({ borderRadius }) => `${borderRadius}px` || "0"};
  object-fit: ${({ objectFit }) => objectFit || "cover"};
  display: ${({ centerImage }) => (centerImage ? "block" : "inline-block")};
  margin: ${({ centerImage }) => (centerImage ? "0 auto" : "initial")};
`;

interface ImageElementComponentProps extends ImageElementProps {
  imageUrl: string;
}

const ImageElement: React.FC<ImageElementComponentProps> = ({
  imageUrl,
  ...props
}) => {
  const processedProps = {
    ...props,
    imageWidth: props.imageWidth?.includes("%")
      ? props.imageWidth
      : `${props.imageWidth}%`,
    imageHeight: props.imageHeight?.includes("%")
      ? props.imageHeight
      : `${props.imageHeight}%`,
  };

  return <StyledImage src={imageUrl} alt="Image" {...processedProps} />;
};

export const defaultImageProps: Partial<ImageElementProps> = {
  imageWidth: "100%",
  imageHeight: "100%",
  borderRadius: "0",
  objectFit: "cover",
  centerImage: false,
};

export default ImageElement;
