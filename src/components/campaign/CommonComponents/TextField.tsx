import React from "react";
import { FormFieldProps } from "./Types";

interface TextFieldProps extends FormFieldProps {
  isMeasurement?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  isMeasurement = false,
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
          value={typeof value === "object" ? "" : value}
          onChange={handleChange}
          className="w-full h-full text-sm text-left text-black/70 bg-white outline-none"
        />
        {isMeasurement && (
          <span className="ml-2 text-sm text-left text-black/50">px</span>
        )}
      </div>
    </div>
  );
};

export default TextField;
