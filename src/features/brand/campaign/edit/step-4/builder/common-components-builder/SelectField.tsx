import React, { useState } from "react";
import ArrowDropdownIcon from "../../../../../../../components/icons/ArrowDropdownIcon";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  iconWidth?: number;
  iconHeight?: number;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  iconWidth = 15,
  iconHeight = 15,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30 relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onClick={handleSelectClick}
          onBlur={() => setIsOpen(false)}
          className="block w-full appearance-none bg-white border-none text-sm text-left text-black/70 outline-none h-full pr-10"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ArrowDropdownIcon isOpen={isOpen} width={iconWidth} height={iconHeight} />
        </div>
      </div>
    </div>
  );
};

export default SelectField;
