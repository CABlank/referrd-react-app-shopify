import React from "react";
import ColorField from "../CommonComponents/ColorField";
import SelectField from "../CommonComponents/SelectField";
import SpacingField from "../CommonComponents/SpacingField";
import NumberField from "../CommonComponents/NumberField";
import TextField from "../CommonComponents/TextField";
import CheckboxField from "../CommonComponents/CheckboxField";
import PercentageField from "../CommonComponents/PercentageField";
import { FormFieldProps } from "../CommonComponents/Types";

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  options,
  onBatchChange,
}) => {
  const isMeasurementField = [
    "imageWidth",
    "imageHeight",
    "borderRadius",
  ].includes(name);

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
          value={
            typeof value === "number" ? value : parseInt(value as string, 10)
          }
          onChange={onChange}
          type={""}
        />
      );
    case "checkbox":
      return (
        <CheckboxField
          label={label}
          name={name}
          value={value as string}
          onChange={onChange}
          type={""}
        />
      );
    case "percentage":
      return (
        <PercentageField
          label={label}
          name={name}
          type={type}
          value={value as string}
          onChange={onChange}
          isMeasurement={isMeasurementField}
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
          isMeasurement={isMeasurementField}
        />
      );
  }
};

export default FormField;
