import React from "react";
import {
  ElementProps,
  TextElementProps,
  ImageElementProps,
} from "../../CommonComponents/Types";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import ReferAndEarn from "./ReferAndEarn";

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
