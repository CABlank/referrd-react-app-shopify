import React, { useState, useEffect, useRef } from "react";
import {
  ElementProps,
  TextElementProps,
  ButtonElementProps,
  InputElementProps,
  DividerElementProps,
  ImageElementProps,
} from "../../common-components-builder/Types";
import FormField from "../FormField";
import ArrowDropdownIcon from "../../../../../../../../components/icons/ArrowDropdownIcon";
import TrashIcon from "../../../../../../../../components/icons/icons-builder/TrashIcon";
import ImageUpload from "../../common-components-builder/ImageUpload";
import fieldConfigs from "./FieldConfigs.json";

interface CustomizationPanelProps {
  view: "desktop" | "mobile";
  elements: ElementProps[];
  onUpdate: (updatedElement: ElementProps) => void;
  onRemove: (elementId: string) => void;
  imageRecentlyAdded: boolean;
  setImageRecentlyAdded: (value: boolean) => void;
}

const defaultTextProps: Partial<TextElementProps> = {
  text: "Default Text",
  fontFamily: "Arial",
  fontSize: "16px",
  textColor: "#000000",
  textTransform: "none",
  fontWeight: "normal",
  letterSpacing: "normal",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

const defaultButtonProps: Partial<ButtonElementProps> = {
  buttonText: "Join Us",
  buttonLink: "#",
  buttonBackgroundColor: "#ffffff",
  buttonTextColor: "#000000",
  buttonBorderColor: "#555555",
  buttonBorderWidth: 1,
  buttonBorderRadius: 8,
  paddingTop: "8px",
  paddingRight: "24px",
  paddingBottom: "8px",
  paddingLeft: "24px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  fontFamily: "Arial",
  fontSize: "14px",
  textAlign: "center",
  textTransform: "none",
  fontWeight: "bold",
  letterSpacing: "normal",
  lineHeight: "normal",
  hoverBackgroundColor: "#ffffff",
  hoverTextColor: "#000000",
  hoverBorderColor: "#555555",
  buttonAlign: "center",
};

const defaultDividerProps: Partial<DividerElementProps> = {
  color: "#000000",
  height: 1,
  width: "100%",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

const defaultImageProps: Partial<ImageElementProps> = {
  imageUrl: "",
  imageWidth: "100px",
  imageHeight: "100px",
  borderRadius: "0px",
  objectFit: "cover",
  centerImage: false,
};

type AllowedElementTypes = "text" | "button" | "input" | "divider" | "image";

const isAllowedElementType = (type: string): type is AllowedElementTypes => {
  return ["text", "button", "input", "divider", "image"].includes(type);
};

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  view,
  elements,
  onUpdate,
  onRemove,
  imageRecentlyAdded,
  setImageRecentlyAdded,
}) => {
  const [openElementId, setOpenElementId] = useState<string | null>(null);

  // Ref to store the previous elements
  const prevElementsRef = useRef<ElementProps[]>([]);

  // UseEffect to handle newly added elements
  useEffect(() => {
    // Detect if a new element has been added by comparing with the previous elements
    const prevElements = prevElementsRef.current;
    if (elements.length > prevElements.length) {
      const newElement = elements.find(
        (element) => !prevElements.some((prevElement) => prevElement.id === element.id)
      );

      // If a new element is detected, open it automatically
      if (newElement) {
        setOpenElementId(newElement.id);
      }
    }

    // Save the current elements as the previous elements for the next comparison
    prevElementsRef.current = elements;
  }, [elements]);

  // UseEffect to specifically handle imageRecentlyAdded for images
  useEffect(() => {
    if (imageRecentlyAdded) {
      const imageElement = elements.find((element) => element.type === "image");
      if (imageElement) {
        setOpenElementId(imageElement.id);
      }
      setImageRecentlyAdded(false);
    }
  }, [elements, imageRecentlyAdded, setImageRecentlyAdded]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    element: ElementProps
  ) => {
    if (!e.target || !e.target.name) {
      console.error("Event target or target name is undefined", e);
      return;
    }

    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === "number") {
      parsedValue =
        value === "" || isNaN(parseInt(value, 10))
          ? (defaultButtonProps[name as keyof ButtonElementProps] as number) || 0
          : parseInt(value, 10);
      parsedValue = parsedValue.toString(); // Ensure parsedValue is a string
    } else if (type === "color" && value === "") {
      parsedValue = "#000000"; // or any default color value
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked ? 1 : 0;
    }

    onUpdate({ ...element, [name]: parsedValue });
  };

  const handleBatchChange = (updatedValues: { [key: string]: string }, element: ElementProps) => {
    const updatedElement = { ...element, ...updatedValues };
    onUpdate(updatedElement);
  };

  const handleImageChange = (file: File | null, element: ElementProps) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (element.type === "image") {
          onUpdate({ ...element, imageUrl: reader.result as string }); // Correct property name
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (element: ElementProps) => {
    if (element.type === "image") {
      onUpdate({ ...element, imageUrl: "" }); // Correct property name
    }
  };

  const toggleElement = (elementId: string) => {
    setOpenElementId(openElementId === elementId ? null : elementId);
  };

  const getFieldValue = (element: ElementProps, field: string) => {
    switch (element.type) {
      case "text":
        return (
          (element as TextElementProps)[field as keyof TextElementProps] ??
          defaultTextProps[field as keyof TextElementProps]
        );
      case "button":
        return (
          (element as ButtonElementProps)[field as keyof ButtonElementProps] ??
          defaultButtonProps[field as keyof ButtonElementProps]
        );
      case "divider":
        return (
          (element as DividerElementProps)[field as keyof DividerElementProps] ??
          defaultDividerProps[field as keyof DividerElementProps]
        );
      case "image":
        return (
          (element as ImageElementProps)[field as keyof ImageElementProps] ??
          defaultImageProps[field as keyof ImageElementProps]
        );
      default:
        return (element as any)?.[field] ?? "";
    }
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
                (element as ButtonElementProps).isPreloaded ? null : element.type ===
                  "input" ? null : (
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
                <ArrowDropdownIcon isOpen={openElementId === element.id} width={20} height={20} />
              </div>
            </div>
            {openElementId === element.id && isAllowedElementType(element.type) && (
              <div className="space-y-4">
                {element.type === "image" ? (
                  <div className="image-options">
                    <label className="block text-sm font-medium text-black/50 mt-4 my-2">
                      Upload Image
                    </label>
                    <ImageUpload
                      imageUrl={(element as ImageElementProps).imageUrl || ""}
                      onImageChange={(file) => handleImageChange(file, element)}
                      onRemoveImage={() => handleRemoveImage(element)}
                    />
                  </div>
                ) : null}
                {fieldConfigs[element.type]?.map((field) => {
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                        handleChange(e, element)
                      }
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
