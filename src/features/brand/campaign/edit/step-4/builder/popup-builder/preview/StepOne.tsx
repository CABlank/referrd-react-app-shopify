import React, { useEffect, useRef } from "react";
import {
  ElementProps,
  TextElementProps,
  ImageElementProps,
  ButtonElementProps,
} from "../../common-components-builder/Types";
import ElementWrapper from "../../common-components-builder/ElementWrapper";
import ReferAndEarn from "./ReferAndEarn";
import { defaultButtonProps } from "../../common-components-builder/ButtonElement"; // Import button props

interface StepOneProps {
  elements: ElementProps[];
  setElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  hoverIndex: number | null;
  elementWidth: string;
  onRemove: (id: string) => void;
  imagePosition: "Right" | "Left" | "None";
  view: "desktop" | "mobile";
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

// Helper function to create the button element
const createDefaultButtonElement = (
  handleSubmit: () => void,
  isPreloaded = true
): ButtonElementProps => {
  return {
    ...defaultButtonProps,
    id: `submit-button`,
    type: "button",
    buttonText: "Join Us",
    buttonLink: "#",
    buttonBackgroundColor: defaultButtonProps.buttonBackgroundColor || "#ffffff",
    buttonTextColor: defaultButtonProps.buttonTextColor || "#000000",
    buttonBorderColor: defaultButtonProps.buttonBorderColor || "#555555",
    buttonBorderWidth: defaultButtonProps.buttonBorderWidth || 1,
    buttonBorderRadius: defaultButtonProps.buttonBorderRadius || 8,
    paddingTop: defaultButtonProps.paddingTop || "4px",
    paddingRight: defaultButtonProps.paddingRight || "16px",
    paddingBottom: defaultButtonProps.paddingBottom || "4px",
    paddingLeft: defaultButtonProps.paddingLeft || "16px",
    marginTop: defaultButtonProps.marginTop || "0px",
    marginRight: defaultButtonProps.marginRight || "0px",
    marginBottom: defaultButtonProps.marginBottom || "0px",
    marginLeft: defaultButtonProps.marginLeft || "0px",
    fontFamily: defaultButtonProps.fontFamily || "Arial",
    fontSize: defaultButtonProps.fontSize || "14",
    textTransform: defaultButtonProps.textTransform || "none",
    fontWeight: defaultButtonProps.fontWeight || "normal",
    letterSpacing: defaultButtonProps.letterSpacing || "normal",
    lineHeight: defaultButtonProps.lineHeight || "normal",
    hoverBackgroundColor: defaultButtonProps.hoverBackgroundColor || "#ffffff",
    hoverTextColor: defaultButtonProps.hoverTextColor || "#000000",
    hoverBorderColor: defaultButtonProps.hoverBorderColor || "#555555",
    width: "100%",
    onClick: handleSubmit,
    isPreloaded,
    textAlign: "center",
    buttonAlign: "center",
  };
};

const StepOne: React.FC<StepOneProps> = ({
  elements,
  setElements,
  moveElement,
  hoverIndex,
  elementWidth,
  onRemove,
  imagePosition,
  view,
  setUrl,
  setStep,
}) => {
  const initialRender = useRef(true);

  // Add the button element when the component mounts
  useEffect(() => {
    if (initialRender.current && elements.length === 0) {
      initialRender.current = false;

      // Create the default button element
      const handleSubmit = () => {};
      const newButtonElement = createDefaultButtonElement(handleSubmit);

      // Add the button element to the elements array
      setElements((prevElements) => [...prevElements, newButtonElement]);
    }
  }, [elements, setElements]);

  const imageElement = elements.find(
    (element): element is ImageElementProps => element.type === "image"
  );

  return (
    <ReferAndEarn
      imagePosition={imagePosition}
      imageUrl={imageElement?.imageUrl}
      imageProps={imageElement}
      view={view}
      onClose={() => setStep(0)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "8px",
          position: "relative",
        }}
      >
        {elements
          .filter((element) => element.type !== "image")
          .map((element, index) => (
            <ElementWrapper
              key={element.id}
              index={index}
              element={element}
              moveElement={moveElement}
              elementWidth={elementWidth}
              hoverIndex={hoverIndex}
              onRemove={onRemove}
              showRemoveButton={false}
              enableDragAndDrop={true}
              view={"desktop"}
              expandedId={undefined}
              onExpand={function (id: string): void {
                throw new Error("Function not implemented.");
              }}
              handleChange={function (
                setter: React.Dispatch<React.SetStateAction<string>>,
                type: string
              ): (e: React.ChangeEvent<HTMLInputElement>) => void {
                throw new Error("Function not implemented.");
              }}
            />
          ))}
        {hoverIndex === elements.length && (
          <div
            style={{
              width: elementWidth,
              borderRight: "0px solid red",
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </ReferAndEarn>
  );
};

export default StepOne;
