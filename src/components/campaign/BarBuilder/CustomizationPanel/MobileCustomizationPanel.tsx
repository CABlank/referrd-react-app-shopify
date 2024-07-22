import React, { useState } from "react";
import {
  ElementProps,
  TextElementProps,
  ButtonElementProps,
} from "../../CommonComponents/Types";
import FormField from "../FormField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import TrashIcon from "../../../Icons/IconsBuilder/TrashIcon";
import { defaultTextProps } from "../../CommonComponents/TextElement";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import fieldConfigs from "./FieldConfigs.json";

interface CustomizationPanelProps {
  elements: ElementProps[];
  onUpdate: (updatedElement: ElementProps) => void;
  onRemove: (elementId: string) => void;
}

// Define the types that are allowed in fieldConfigs
type AllowedElementTypes = "text" | "button";

// Type guard to check if the element type is allowed
const isAllowedElementType = (type: string): type is AllowedElementTypes => {
  return ["text", "button"].includes(type);
};

const MobileCustomizationPanel: React.FC<CustomizationPanelProps> = ({
  elements,
  onUpdate,
  onRemove,
}) => {
  const [openElementId, setOpenElementId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    element: ElementProps
  ) => {
    if (!e.target || !e.target.name) {
      console.error("Event target or target name is undefined", e);
      return;
    }

    const { name, value } = e.target;
    const parsedValue =
      name === "buttonBorderWidth" || name === "buttonBorderRadius"
        ? parseInt(value, 10).toString()
        : value;
    onUpdate({ ...element, [name]: parsedValue });
  };

  const handleBatchChange = (
    updatedValues: { [key: string]: string },
    element: ElementProps
  ) => {
    const updatedElement = { ...element, ...updatedValues };
    onUpdate(updatedElement);
  };

  const toggleElement = (elementId: string) => {
    setOpenElementId(openElementId === elementId ? null : elementId);
  };

  const getFieldValue = (element: ElementProps, field: string) => {
    return (
      (element as any)?.[field] ??
      (element?.type === "text"
        ? defaultTextProps[field as keyof TextElementProps]
        : defaultButtonProps[field as keyof ButtonElementProps])
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg mb-4">
      <h2 className="font-semibold">Customize Elements</h2>
      {elements.map((element) => (
        <div key={element?.id} className="mt-4">
          <div
            className="flex justify-between items-center cursor-pointer p-2 bg-white mb-4"
            onClick={() => element && toggleElement(element.id)}
          >
            <div className="flex items-center w-full">
              <h3 className="text-sm font-medium flex items-center">
                <span className="ml-1 capitalize">{element?.type}</span>
              </h3>
              <button
                className="text-red-500 flex items-center ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (element) {
                    onRemove(element.id);
                  }
                }}
              >
                <TrashIcon />
              </button>
            </div>
            <div className="flex items-center">
              <ArrowDropdownIcon
                isOpen={openElementId === element?.id}
                width={20}
                height={20}
              />
            </div>
          </div>
          {openElementId === element?.id &&
            isAllowedElementType(element.type) && (
              <div className="space-y-4">
                {fieldConfigs[element?.type]?.map((field) => (
                  <FormField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={getFieldValue(element, field.name)}
                    onChange={(e) => handleChange(e, element)}
                    onBatchChange={
                      field.type === "margin" || field.type === "padding"
                        ? (updatedValues: { [key: string]: string }) =>
                            handleBatchChange(updatedValues, element)
                        : undefined
                    }
                    options={field.options}
                  />
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default MobileCustomizationPanel;
