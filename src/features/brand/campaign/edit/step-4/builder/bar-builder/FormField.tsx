import React from "react";
import ColorField from "../common-components-builder/ColorField";
import SelectField from "../common-components-builder/SelectField";
import SpacingField from "../common-components-builder/SpacingField";
import NumberField from "../common-components-builder/NumberField";
import TextField from "../common-components-builder/TextField";
import { FormFieldProps } from "../common-components-builder/Types";

// Define the FormField component with props typed with FormFieldProps
const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  onBatchChange,
  options,
}) => {
  // Check if the 'name' prop is provided, if not log an error and prevent rendering
  if (!name) {
    console.error("FormField is missing the 'name' prop", {
      label,
      type,
      value,
      options,
    });
    return null; // Return null to prevent rendering of the component without a name
  }

  // Function to render the appropriate field based on the 'type' prop
  const renderField = () => {
    switch (type) {
      case "select":
        // Render a SelectField component for 'select' type
        return (
          <SelectField
            label={label}
            name={name}
            value={value as string}
            onChange={onChange}
            options={options || []} // Ensure options is an array
          />
        );
      case "color":
        // Render a ColorField component for 'color' type
        return <ColorField label={label} name={name} value={value as string} onChange={onChange} />;
      case "padding":
      case "margin":
        // Render a SpacingField component for 'padding' or 'margin' type
        return (
          <SpacingField
            label={label}
            name={name}
            type={type}
            value={typeof value === "object" ? value : {}}
            onChange={onBatchChange!} // Ensure onBatchChange is called, assuming it's provided for spacing fields
          />
        );
      case "number":
        // Render a NumberField component for 'number' type
        return (
          <NumberField
            label={label}
            name={name}
            value={value !== undefined ? value : 0} // Default to 0 if value is undefined
            onChange={onChange}
            type={""} // The type prop is not used in NumberField but is required by its interface
          />
        );
      default:
        // Render a TextField component for any other types
        return (
          <TextField
            label={label}
            name={name}
            type={type}
            value={value as string}
            onChange={onChange}
          />
        );
    }
  };

  // Execute the renderField function to render the appropriate field
  return renderField();
};

export default FormField;
