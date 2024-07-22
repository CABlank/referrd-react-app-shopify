import React from "react";
import ColorField from "../CommonComponents/ColorField";
import SelectField from "../CommonComponents/SelectField";
import SpacingField from "../CommonComponents/SpacingField";
import NumberField from "../CommonComponents/NumberField";
import TextField from "../CommonComponents/TextField";
import { FormFieldProps } from "../CommonComponents/Types";

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  onBatchChange,
  options,
}) => {
  if (!name) {
    console.error("FormField is missing the 'name' prop", {
      label,
      type,
      value,
      options,
    });
    return null; // Prevent rendering without a name
  }

  switch (type) {
    case "select":
      return (
        <SelectField
          label={label}
          name={name}
          value={value as string}
          onChange={onChange}
          options={options || []}
        />
      );
    case "color":
      return (
        <ColorField
          label={label}
          name={name}
          value={value as string}
          onChange={onChange}
        />
      );
    case "padding":
    case "margin":
      const spacingValue = typeof value === "string" ? {} : value || {};
      return (
        <SpacingField
          label={label}
          name={name}
          type={type}
          value={typeof value === "object" ? value : {}}
          onChange={onBatchChange!}
        />
      );
    case "number":
      return (
        <NumberField
          label={label}
          name={name}
          value={value !== undefined ? value : 0}
          onChange={onChange}
          type={""}
        />
      );
    default:
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

export default FormField;
