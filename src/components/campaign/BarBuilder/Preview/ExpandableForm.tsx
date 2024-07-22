import React, { useState, useEffect, useRef, useCallback } from "react";
import ExpandableInput from "./ExpandableInput";
import NameIcon from "../../../Icons/IconsBuilder/NameIcon";
import EmailIcon from "../../../Icons/IconsBuilder/EmailIcon";
import MobileIcon from "../../../Icons/IconsBuilder/MobileIcon";
import { sanitizeInput, validateInput } from "../../../../utils/sanitizeInput";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import { ElementProps } from "../../CommonComponents/Types";

interface ExpandableFormProps {
  view: "desktop" | "mobile";
  onSubmit: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  elements: ElementProps[];
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  hoverIndex: number | null;
  elementWidth: string;
  onRemove: (id: string) => void;
}

interface ErrorState {
  name?: string;
  email?: string;
  number?: string;
  [key: string]: any;
}

const ExpandableForm: React.FC<ExpandableFormProps> = ({
  view,
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  number,
  setNumber,
  elements,
  moveElement,
  hoverIndex,
  elementWidth,
  onRemove,
}) => {
  const [expandedInput, setExpandedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorState>({});

  const formRef = useRef<HTMLDivElement>(null);

  const handleFocus = useCallback((field: string) => {
    setExpandedInput(field);
  }, []);

  const handleBlur = useCallback(() => {
    if (view === "mobile") {
      setExpandedInput(null);
    }
  }, [view]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleBlur();
      }
    },
    [handleBlur]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (view === "desktop") {
      setExpandedInput(null);
    }
  }, [view]);

  const handleChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, type: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = sanitizeInput(e.target.value);
        setter(value);

        if (!validateInput(value, type)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [type]: `Invalid ${type}`,
          }));
        } else {
          setErrors((prevErrors) => {
            const { [type]: _, ...rest } = prevErrors;
            return rest;
          });
        }
      },
    []
  );

  const handleSubmit = useCallback(() => {
    const isNameValid = validateInput(name, "text");
    const isEmailValid = validateInput(email, "email");
    const isNumberValid = validateInput(number, "tel");

    if (isNameValid && isEmailValid && isNumberValid) {
      onSubmit();
    } else {
      setErrors({
        ...(isNameValid ? {} : { name: "Invalid name" }),
        ...(isEmailValid ? {} : { email: "Invalid email" }),
        ...(isNumberValid ? {} : { number: "Invalid phone number" }),
      });
    }
  }, [name, email, number, onSubmit]);

  const renderExpandableInput = (
    type: string,
    value: string,
    placeholder: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    icon?: React.ReactNode
  ) => (
    <ExpandableInput
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={handleChange(setter, type)}
      isExpanded={expandedInput === type}
      onFocus={() => handleFocus(type)}
      onBlur={handleBlur}
      view={view}
      icon={icon}
      error={!!errors[type]}
    />
  );

  return (
    <div
      ref={formRef}
      className="flex flex-col md:flex-row justify-start items-center flex-grow-0 flex-shrink-0 gap-4"
    >
      {view === "desktop" ? (
        <>
          {renderExpandableInput("text", name, "Name", setName)}
          {renderExpandableInput("email", email, "Email", setEmail)}
          {renderExpandableInput("tel", number, "Phone", setNumber)}
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[97px] h-9 relative gap-2 px-6 py-2.5 rounded-lg bg-white">
            <button
              id="join-us-button" // Add ID to the button
              className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#0d0c16]"
              onClick={handleSubmit}
            >
              Join us
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0">
          <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-white">
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
                />
              );
            })}
          </p>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-full gap-2">
            {renderExpandableInput("text", name, "Name", setName, <NameIcon />)}
            {renderExpandableInput(
              "email",
              email,
              "Email",
              setEmail,
              <EmailIcon />
            )}
            {renderExpandableInput(
              "tel",
              number,
              "Phone",
              setNumber,
              <MobileIcon />
            )}
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-4 py-2.5 rounded-lg bg-white h-8">
              <button
                id="join-us-button" // Add ID to the button
                className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-black"
                onClick={handleSubmit}
              >
                Join us
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableForm;
