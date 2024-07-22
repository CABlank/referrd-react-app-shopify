import React from "react";
import { FormFieldProps } from "./Types";

interface PercentageFieldProps extends FormFieldProps {
  isMeasurement?: boolean;
}

const PercentageField: React.FC<PercentageFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30">
        <input
          type={type}
          name={name}
          value={
            (value as string | number | readonly string[] | undefined) ?? ""
          }
          onChange={handleChange}
          className="w-full h-full text-sm text-left text-black/70 bg-white outline-none"
        />
        <span className="ml-2 text-sm text-left text-black/50">%</span>
      </div>
    </div>
  );
};

export default PercentageField;
