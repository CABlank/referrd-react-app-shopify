import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ElementProps,
  ButtonElementProps,
  InputElementProps,
  TextElementProps,
} from "../../CommonComponents/Types";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import { sanitizeInput } from "../../../../utils/sanitizeInput";

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
  enableDragAndDrop: boolean;
}

const createDefaultButtonElement = (
  handleSubmit: () => void,
  isPreloaded = false
): ButtonElementProps => {
  return {
    ...defaultButtonProps,
    id: `button-${Date.now()}`,
    type: "button",
    buttonText: defaultButtonProps.buttonText || "Join Us",
    buttonLink: "#",
    buttonBackgroundColor:
      defaultButtonProps.buttonBackgroundColor || "#ffffff",
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
    onClick: handleSubmit,
    isPreloaded,
    textAlign: "center",
    buttonAlign: "center",
  };
};

const createDefaultInputElement = (
  inputType: "text" | "email" | "tel",
  placeholder: string
): InputElementProps => {
  return {
    id: `input-${inputType}-${Date.now()}`,
    type: "input",
    value: "",
    placeholder: placeholder,
    bordercolor: "#FFFFFF",
    textcolor: "#FFFFFF",
    borderwidth: 1,
    borderradius: 8,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {},
  };
};

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
  enableDragAndDrop,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);
  const initialRender = useRef(true);

  const handleSubmit = useCallback(() => {
    console.log("handleSubmit called");
    const uniqueUrl = `https://example.com/?name=${name}&email=${email}&number=${number}`;
    setUrl(uniqueUrl);
    console.log("URL set to:", uniqueUrl);

    window.parent.postMessage("goToStep2", "*");

    if (view === "mobile") {
      const newElement: ElementProps = {
        id: `${Date.now()}`,
        type: "text",
        props: {
          name,
          email,
          number,
        },
      } as unknown as TextElementProps;
      setElements((prevElements) => [...prevElements, newElement]);
      console.log("New element added in mobile view:", newElement);
    }

    if (allowStepChange) {
      setStep(2);
      console.log("Step changed to 2");
    } else {
      console.log("Step change not allowed");
    }
  }, [
    name,
    email,
    number,
    setUrl,
    setStep,
    allowStepChange,
    setElements,
    view,
  ]);

  const handleChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, type: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = sanitizeInput(e.target.value);
        setter(value);
        console.log(`Changing ${type} to ${value}`);
      },
    []
  );

  useEffect(() => {
    console.log(
      `StepOne useEffect triggered, elements.length: ${elements.length}`
    );
    if (initialRender.current && elements.length === 0) {
      initialRender.current = false;
      const preloadedInputs: InputElementProps[] = [
        createDefaultInputElement("text", "Name"),
        createDefaultInputElement("email", "Email"),
        createDefaultInputElement("tel", "Number"),
      ];

      const newButtonElement = createDefaultButtonElement(handleSubmit, true); // Set isPreloaded to true
      console.log("Setting initial elements:", [
        ...preloadedInputs,
        newButtonElement,
      ]);
      setElements([...preloadedInputs, newButtonElement]);
    }
  }, [elements.length, handleSubmit, setElements]);

  useEffect(() => {
    console.log("Updated elements in StepOne:", elements);
  }, [elements]);

  return (
    <>
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-0">
        {elements.map((element, index) => {
          if (!element || !("id" in element)) {
            console.error("Invalid element at index:", index, element);
            return null;
          }
          console.log("Rendering element in ElementWrapper:", element);
          return (
            <ElementWrapper
              key={element.id}
              index={index}
              element={element}
              moveElement={moveElement}
              elementWidth={elementWidth}
              hoverIndex={hoverIndex}
              onRemove={onRemove}
              showRemoveButton={
                element.type === "button" &&
                !(element as ButtonElementProps).isPreloaded
                  ? false
                  : false
              }
              enableDragAndDrop={enableDragAndDrop}
              view={view}
              expandedId={expandedId}
              onExpand={setExpandedId}
              handleChange={handleChange}
              handleSubmit={handleSubmit} // Pass handleSubmit
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
    </>
  );
};

export default StepOne;
