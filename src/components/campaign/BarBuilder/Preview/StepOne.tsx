import React, { useState } from "react";
import { ElementProps } from "../../CommonComponents/Types";
import ExpandableForm from "./ExpandableForm";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import { TextElementProps } from "../../CommonComponents/Types";

interface StepOneProps {
  elements: ElementProps[];
  setElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  hoverIndex: number | null;
  elementWidth: string;
  onRemove: (id: string) => void;
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
  view,
  setUrl,
  setStep,
  allowStepChange,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");

  const handleSubmit = () => {
    const uniqueUrl = `https://example.com/?name=${name}&email=${email}&number=${number}`;
    setUrl(uniqueUrl);

    if (view === "mobile") {
      const newElement: ElementProps = {
        id: `${Date.now()}`, // Generate a unique ID for the new element
        type: "text",
        props: {
          name,
          email,
          number,
        },
      } as unknown as TextElementProps;
      setElements((prevElements) => [...prevElements, newElement]);
    }

    if (allowStepChange) {
      setStep(2);
    }
  };

  return (
    <>
      {view === "desktop" && (
        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-0">
          {elements.map((element, index) => {
            if (!element || !element.id) {
              console.error("Invalid element at index:", index, element);
              return null;
            }
            return (
              <ElementWrapper
                key={element.id}
                index={index}
                element={element}
                moveElement={moveElement}
                elementWidth={elementWidth}
                hoverIndex={hoverIndex}
                onRemove={onRemove}
                showRemoveButton={false}
                enableDragAndDrop={true} // Ensure this is set to true
              />
            );
          })}
          {hoverIndex === elements.length && (
            <div
              className="flex-shrink-0"
              style={{ width: elementWidth, borderRight: "2px solid red" }}
            />
          )}
        </div>
      )}
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-4">
        <ExpandableForm
          view={view}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          number={number}
          setNumber={setNumber}
          onSubmit={handleSubmit}
          elements={elements}
          moveElement={moveElement}
          hoverIndex={hoverIndex}
          elementWidth={elementWidth}
          onRemove={onRemove}
        />
      </div>
    </>
  );
};

export default StepOne;
