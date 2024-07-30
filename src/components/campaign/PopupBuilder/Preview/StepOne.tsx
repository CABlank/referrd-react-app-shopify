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
  allowStepChange: boolean;
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
  allowStepChange,
}) => {
  const imageElement = elements.find(
    (element): element is ImageElementProps => element.type === "image"
  );

  const handleSubmit = async (
    name: string,
    email: string,
    number: string
  ): Promise<boolean> => {
    const uniqueUrl = `https://example.com/?name=${name}&email=${email}&number=${number}`;
    setUrl(uniqueUrl);

    if (view === "mobile") {
      const newElement: TextElementProps = {
        id: `${Date.now()}`, // Generate a unique ID for the new element
        type: "text",
        text: `${name} ${email} ${number}`,
        fontFamily: "",
        fontSize: "",
        textColor: "",
        textTransform: "none",
        fontWeight: "normal",
        letterSpacing: "",
        marginTop: "",
        marginRight: "",
        marginBottom: "",
        marginLeft: "",
      };
      setElements((prevElements) => [...prevElements, newElement]);
    }

    if (allowStepChange) {
      setStep(2);
    }

    // Simulate an asynchronous operation and return true
    return Promise.resolve(true);
  };

  return (
    <ReferAndEarn
      imagePosition={imagePosition}
      imageUrl={imageElement?.imageUrl}
      imageProps={imageElement}
      view={view}
      onSubmit={handleSubmit}
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
