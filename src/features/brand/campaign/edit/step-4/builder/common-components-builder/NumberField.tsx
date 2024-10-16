import React from "react";
import styled from "styled-components";
import { FormFieldProps } from "./Types";
import PlusIcon from "../../../../../../../components/icons/icons-builder/PlusIcon";
import MinusIcon from "../../../../../../../components/icons/icons-builder/MinusIcon";

// Styled component for the input field
const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: white;
  outline: none;
  border: none;
  color: #808080;

  /* Hide the default spinner controls in number inputs for WebKit browsers (Chrome, Safari) */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide the default spinner controls in number inputs for Firefox */
  -moz-appearance: textfield;
`;

const NumberField: React.FC<FormFieldProps> = ({ label, name, value, onChange }) => {
  const increment = () => {
    const newValue = Number(value) + 1;
    onChange({
      target: { name, value: newValue },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const decrement = () => {
    const newValue = Number(value) - 1;
    onChange({
      target: { name, value: newValue },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30">
        <button
          type="button"
          onClick={decrement}
          className="flex items-center justify-center w-6 h-6"
        >
          <MinusIcon />
        </button>
        <StyledInput type="number" name={name} value={value as number} onChange={onChange} />
        <button
          type="button"
          onClick={increment}
          className="flex items-center justify-center w-6 h-6"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default NumberField;
