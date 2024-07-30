import React, { useState } from "react";
import {
  ElementProps,
  TextElementProps,
  ButtonElementProps,
  InputElementProps,
} from "../../CommonComponents/Types";
import FormField from "../FormField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import TrashIcon from "../../../Icons/IconsBuilder/TrashIcon";
import { defaultTextProps } from "../../CommonComponents/TextElement";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import fieldConfigs from "./FieldConfigs.json";

interface CustomizationPanelProps {
  view: "desktop" | "mobile";
  elements: ElementProps[];
  onUpdate: (updatedElement: ElementProps) => void;
  onRemove: (elementId: string) => void;
}

type AllowedElementTypes = "text" | "button" | "input";

const isAllowedElementType = (type: string): type is AllowedElementTypes => {
  return ["text", "button", "input"].includes(type);
};

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  view,
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
    console.log("Updating element:", element.id, "with", name, parsedValue);
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
        : element?.type === "button"
          ? defaultButtonProps[field as keyof ButtonElementProps]
          : [field as keyof InputElementProps])
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg mb-4">
      <h2 className="font-semibold">Customize Elements</h2>
      {elements.map((element) => {
        if (!element || !("id" in element)) {
          console.error("Invalid element:", element);
          return null;
        }
        return (
          <div key={element.id} className="mt-4">
            <div
              className="flex justify-between items-center cursor-pointer p-2 bg-white mb-4"
              onClick={() => toggleElement(element.id)}
            >
              <div className="flex items-center w-full">
                <h3 className="text-sm font-medium flex items-center">
                  <span className="ml-1 capitalize">{element.type}</span>
                </h3>
                {element.type === "button" &&
                (element as ButtonElementProps)
                  .isPreloaded ? null : element.type === "input" ? null : (
                  <button
                    className="text-red-500 flex items-center ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(element.id);
                    }}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <ArrowDropdownIcon
                  isOpen={openElementId === element.id}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            {openElementId === element.id &&
              isAllowedElementType(element.type) && (
                <div className="space-y-4">
                  {fieldConfigs[element.type]?.map((field) => {
                    // Hide buttonLink field only for preloaded buttons
                    if (
                      element.type === "button" &&
                      field.name === "buttonLink" &&
                      (element as ButtonElementProps).isPreloaded
                    ) {
                      return null;
                    }
                    return (
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
                        options={"options" in field ? field.options : undefined}
                      />
                    );
                  })}
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomizationPanel;
