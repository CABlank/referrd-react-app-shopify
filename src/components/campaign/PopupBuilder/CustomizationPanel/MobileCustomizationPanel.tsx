/*import React, { useState, useEffect } from "react";
import { ElementProps } from "../../CommonComponents/Types";
import FormField from "../FormField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import TrashIcon from "../../../Icons/IconsBuilder/TrashIcon";
import fieldConfigs from "./FieldConfigs.json";
import ImageUpload from "../../CommonComponents/ImageUpload";

interface CustomizationPanelProps {
  elements: ElementProps[];
  onUpdate: (updatedElement: ElementProps) => void;
  onRemove: (elementId: string) => void;
  imageRecentlyAdded: boolean;
  setImageRecentlyAdded: (value: boolean) => void;
}

const MobileCustomizationPanel: React.FC<CustomizationPanelProps> = ({
  elements,
  onUpdate,
  onRemove,
  imageRecentlyAdded,
  setImageRecentlyAdded,
}) => {
  const [openElementId, setOpenElementId] = useState<string | null>(null);

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
    const { name, value, type } = e.target;
    const updatedValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    onUpdate({ ...element, [name]: updatedValue });
  };

  const handleBatchChange = (
    updatedValues: { [key: string]: string },
    element: ElementProps
  ) => {
    const updatedElement = { ...element, ...updatedValues };
    onUpdate(updatedElement);
  };

  const handleImageChange = (file: File | null, element: ElementProps) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (element.type === "image") {
          onUpdate({ ...element, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (element: ElementProps) => {
    if (element.type === "image") {
      onUpdate({ ...element, imageUrl: "" });
    }
  };

  const toggleElement = (elementId: string) => {
    setOpenElementId(openElementId === elementId ? null : elementId);
  };

  const getFieldValue = (element: ElementProps, field: string) => {
    return (element as any)[field] ?? "";
  };

  const renderFormFields = (element: ElementProps) => {
    return fieldConfigs[element.type].map(
      (field: {
        label: string;
        name: string;
        type: string;
        options?: string[];
      }) => (
        <FormField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          value={getFieldValue(element, field.name)}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
          ) => handleChange(e, element)}
          onBatchChange={
            field.type === "margin" || field.type === "padding"
              ? (updatedValues: { [key: string]: string }) =>
                  handleBatchChange(updatedValues, element)
              : undefined // Do not use onBatchChange for single field updates
          }
          options={field.options}
          style={
            element.type === "image"
              ? { paddingTop: "4px", paddingBottom: "4px" }
              : undefined
          }
        />
      )
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg mb-4">
      <h2 className="font-semibold">Customize Elements</h2>
      {elements.map((element) => (
        <div key={element?.id} className="mt-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 bg-white"
            onClick={() => element && toggleElement(element.id)}
          >
            <div className="flex items-center w-full">
              <h3 className="text-base font-medium flex items-center">
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
          {openElementId === element?.id && (
            <div className="space-y-4">
              {element?.type === "image" ? (
                <div className="image-options">
                  <label className="block text-sm font-medium text-black/50 mt-4 my-2">
                    Upload Image
                  </label>
                  <ImageUpload
                    imageUrl={element.imageUrl || ""}
                    onImageChange={(file) =>
                      element && handleImageChange(file, element)
                    }
                    onRemoveImage={() => element && handleRemoveImage(element)}
                  />
                  {element && renderFormFields(element)}
                </div>
              ) : (
                element && renderFormFields(element)
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileCustomizationPanel;
*/
