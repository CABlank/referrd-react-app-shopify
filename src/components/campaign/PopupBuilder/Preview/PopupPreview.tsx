import React, { useState, useRef, LegacyRef } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import {
  ElementProps,
  PopupConfig,
  ItemTypes,
  DragItem,
} from "../../CommonComponents/Types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { v4 as uuidv4 } from "uuid";
import { defaultTextProps } from "../../CommonComponents/TextElement";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import { defaultDividerProps } from "../../CommonComponents/DividerElement";

const defaultImageProps = {
  imageUrl: "",
  imageWidth: "100",
  imageHeight: "100",
  borderRadius: "0", // Changed to string
  objectFit: "cover" as "cover", // Ensuring objectFit is one of the specific string literals
  centerImage: false,
};

interface PopupPreviewProps {
  stepOneElements: ElementProps[];
  setStepOneElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  stepTwoElements: ElementProps[];
  setStepTwoElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  view: "desktop" | "mobile";
  config: PopupConfig;
  step: number;
  onImageAdd: () => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const PopupPreview: React.FC<PopupPreviewProps> = ({
  stepOneElements,
  setStepOneElements,
  stepTwoElements,
  setStepTwoElements,
  view,
  config,
  step,
  onImageAdd,
  setStep,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [imageRecentlyAdded, setImageRecentlyAdded] = useState(false);
  const [url, setUrl] = useState<string>(""); // Add url state
  const containerRef = useRef<HTMLDivElement>(null);

  const imageExists = (elements: ElementProps[]) => {
    return elements.some((element) => element.type === "image");
  };

  const moveElement = (
    elements: ElementProps[],
    setElements: React.Dispatch<React.SetStateAction<ElementProps[]>>,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const updatedElements = [...elements];
    const [removed] = updatedElements.splice(dragIndex, 1);
    updatedElements.splice(hoverIndex, 0, removed);
    setElements(updatedElements);
  };

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: [
      ItemTypes.TEXT_ELEMENT,
      ItemTypes.BUTTON_ELEMENT,
      ItemTypes.IMAGE,
      ItemTypes.DIVIDER_ELEMENT,
    ],
    canDrop: (item: DragItem) => {
      return (
        item.type !== ItemTypes.IMAGE ||
        !imageExists(step === 1 ? stepOneElements : stepTwoElements)
      );
    },
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!containerRef.current) return;

      const hoverBoundingRect = containerRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return; // Check if clientOffset is defined
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      let newHoverIndex = Math.floor(
        (hoverClientX / hoverBoundingRect.width) *
          (step === 1 ? stepOneElements.length : stepTwoElements.length)
      );
      newHoverIndex = Math.max(
        0,
        Math.min(
          step === 1 ? stepOneElements.length : stepTwoElements.length,
          newHoverIndex
        )
      );
      setHoverIndex(newHoverIndex);
    },
    drop: (item: DragItem) => {
      if (
        item.type === ItemTypes.IMAGE &&
        imageExists(step === 1 ? stepOneElements : stepTwoElements)
      ) {
        return;
      }

      const newIndex =
        hoverIndex !== null
          ? hoverIndex
          : step === 1
            ? stepOneElements.length
            : stepTwoElements.length;

      const newElements =
        step === 1 ? [...stepOneElements] : [...stepTwoElements];

      const existingIndex = newElements.findIndex(
        (element) => element.id === item.id
      );
      if (existingIndex !== -1) {
        const [movedElement] = newElements.splice(existingIndex, 1);
        newElements.splice(newIndex, 0, movedElement);
      } else {
        let newElement: ElementProps;
        if (item.type === ItemTypes.TEXT_ELEMENT) {
          newElement = {
            id: uuidv4(),
            type: "text",
            ...defaultTextProps,
            text: "",
            fontFamily: "",
            fontSize: "",
            textColor: "",
            textTransform: "none",
            fontWeight: "normal",
            letterSpacing: "0",
            marginTop: "0",
            marginRight: "0",
            marginBottom: "0",
            marginLeft: "0",
          }; // Ensure all required properties are strings
        } else if (item.type === ItemTypes.BUTTON_ELEMENT) {
          newElement = {
            id: uuidv4(),
            type: "button",
            ...defaultButtonProps,
            buttonText: "",
            buttonLink: "",
            buttonBackgroundColor: "",
            buttonTextColor: "",
            buttonBorderColor: "",
            buttonBorderWidth: 0,
            buttonBorderRadius: 0,
            paddingTop: "0",
            paddingRight: "0",
            paddingBottom: "0",
            paddingLeft: "0",
            marginTop: "0",
            marginRight: "0",
            marginBottom: "0",
            marginLeft: "0",
            fontFamily: "",
            fontSize: "",
            textAlign: "left",
            textTransform: "none",
            fontWeight: "normal",
            letterSpacing: "0",
            lineHeight: "1",
            hoverBackgroundColor: "",
            hoverTextColor: "",
            hoverBorderColor: "",
            buttonAlign: "flex-start",
          }; // Ensure all required properties are strings
        } else if (item.type === ItemTypes.DIVIDER_ELEMENT) {
          newElement = {
            id: uuidv4(),
            type: "divider",
            ...defaultDividerProps,
          };
        } else {
          newElement = { id: uuidv4(), type: "image", ...defaultImageProps };
        }

        newElements.splice(newIndex, 0, newElement);

        if (item.type === ItemTypes.IMAGE) {
          setImageRecentlyAdded(true);
          onImageAdd();
        }
      }

      if (step === 1) {
        setStepOneElements(newElements);
      } else {
        setStepTwoElements(newElements);
      }
      setHoverIndex(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const elementWidth = `${
    100 /
    ((step === 1 ? stepOneElements.length : stepTwoElements.length) +
      (hoverIndex !== null ? 1 : 0))
  }%`;

  const handleRemoveElement = (elementId: string) => {
    if (step === 1) {
      setStepOneElements((prevElements) =>
        prevElements.filter((element) => element.id !== elementId)
      );
    } else {
      setStepTwoElements((prevElements) =>
        prevElements.filter((element) => element.id !== elementId)
      );
    }
  };

  const commonStyle: React.CSSProperties = {
    height: `${config.height}`,
    width: `${config.width}`,
    borderRadius: `${config.borderWidth}`,
    backgroundColor: config.backgroundColor,
  };

  const desktopStyle: React.CSSProperties = {
    ...commonStyle,
    overflowX: "hidden",
    position: "relative",
    margin: "0 auto",
  };

  const mobileStyle: React.CSSProperties = {
    ...commonStyle,
    maxWidth: "100%",
    width: `${config.width}`,
    margin: "0 auto",
  };

  return (
    <div
      ref={drop as unknown as LegacyRef<HTMLDivElement>}
      className={`popup-preview flex items-center justify-center relative ${
        isOver ? "bg-gray-100" : ""
      }`}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={`flex h-full items-center justify-center ${
          config.ImagePosition === "Left" ? "flex-row-reverse" : ""
        }`}
        ref={containerRef}
        style={{
          flexWrap: "nowrap",
          overflowX: view === "desktop" ? "hidden" : "hidden",
          overflowY: "hidden",
        }}
      >
        <div
          className="popup-content"
          style={view === "desktop" ? desktopStyle : mobileStyle}
        >
          {step === 1 && (
            <StepOne
              elements={stepOneElements}
              setElements={setStepOneElements}
              moveElement={(dragIndex, hoverIndex) =>
                moveElement(
                  stepOneElements,
                  setStepOneElements,
                  dragIndex,
                  hoverIndex
                )
              }
              hoverIndex={hoverIndex}
              elementWidth={elementWidth}
              onRemove={handleRemoveElement}
              imagePosition={config.ImagePosition}
              view={view}
              setUrl={setUrl} // Pass setUrl to StepOne
              setStep={setStep} // Properly pass setStep
              allowStepChange={true}
            />
          )}
          {step === 2 && (
            <StepTwo
              elements={stepTwoElements}
              setElements={setStepTwoElements}
              moveElement={(dragIndex, hoverIndex) =>
                moveElement(
                  stepTwoElements,
                  setStepTwoElements,
                  dragIndex,
                  hoverIndex
                )
              }
              hoverIndex={hoverIndex}
              elementWidth={elementWidth}
              onRemove={handleRemoveElement}
              view={view}
              url={url} // Pass url to StepTwo
              onClose={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupPreview;
