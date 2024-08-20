var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from "react";
import styled from "styled-components";
import PlusIcon from "../../Icons/IconsBuilder/PlusIcon";
import MinusIcon from "../../Icons/IconsBuilder/MinusIcon";
// Styled component for the input field
var StyledInput = styled.input(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  background-color: white;\n  outline: none;\n  border: none;\n  color: #808080;\n\n  /* Hide the default spinner controls in number inputs for WebKit browsers (Chrome, Safari) */\n  &::-webkit-outer-spin-button,\n  &::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n\n  /* Hide the default spinner controls in number inputs for Firefox */\n  -moz-appearance: textfield;\n"], ["\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  background-color: white;\n  outline: none;\n  border: none;\n  color: #808080;\n\n  /* Hide the default spinner controls in number inputs for WebKit browsers (Chrome, Safari) */\n  &::-webkit-outer-spin-button,\n  &::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n\n  /* Hide the default spinner controls in number inputs for Firefox */\n  -moz-appearance: textfield;\n"])));
var NumberField = function (_a) {
    var label = _a.label, name = _a.name, value = _a.value, onChange = _a.onChange;
    var increment = function () {
        var newValue = Number(value) + 1;
        onChange({
            target: { name: name, value: newValue },
        });
    };
    var decrement = function () {
        var newValue = Number(value) - 1;
        onChange({
            target: { name: name, value: newValue },
        });
    };
    return (<div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30">
        <button type="button" onClick={decrement} className="flex items-center justify-center w-6 h-6">
          <MinusIcon />
        </button>
        <StyledInput type="number" name={name} value={value} onChange={onChange}/>
        <button type="button" onClick={increment} className="flex items-center justify-center w-6 h-6">
          <PlusIcon />
        </button>
      </div>
    </div>);
};
export default NumberField;
var templateObject_1;
