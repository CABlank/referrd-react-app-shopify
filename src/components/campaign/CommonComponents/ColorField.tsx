import React from "react";
import styled from "styled-components";

interface ColorFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledColorInput = styled.input<{ colorvalue: string }>`
  width: 24px; // Adjusted size to match the design
  height: 24px; // Adjusted size to match the design
  padding: 0;
  border-radius: 50%;
  border: ${(props) =>
    props.colorvalue === "#ffffff" ||
    props.colorvalue === "#fff" ||
    props.colorvalue === "#FFFFFF" ||
    props.colorvalue === "#FFF"
      ? "1px solid #000"
      : "none"};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 50%;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
  }
`;

const ColorField: React.FC<ColorFieldProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex justify-end items-center w-[80px] relative gap-2">
        <p className="text-xs font-medium text-left text-black/50">{value}</p>
        <div className="flex justify-start items-center gap-4 rounded-[100px]">
          <StyledColorInput
            type="color"
            name={name}
            value={value}
            onChange={onChange}
            colorvalue={value} // Pass the color value as a prop
          />
        </div>
      </div>
    </div>
  );
};

export default ColorField;
