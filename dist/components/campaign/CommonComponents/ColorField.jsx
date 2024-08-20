var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from "react";
import styled from "styled-components";
var StyledColorInput = styled.input(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 24px; // Adjusted size to match the design\n  height: 24px; // Adjusted size to match the design\n  padding: 0;\n  border-radius: 50%;\n  border: ", ";\n  cursor: pointer;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n\n  &::-webkit-color-swatch-wrapper {\n    padding: 0;\n    border-radius: 50%;\n  }\n\n  &::-webkit-color-swatch {\n    border: none;\n    border-radius: 50%;\n  }\n"], ["\n  width: 24px; // Adjusted size to match the design\n  height: 24px; // Adjusted size to match the design\n  padding: 0;\n  border-radius: 50%;\n  border: ", ";\n  cursor: pointer;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n\n  &::-webkit-color-swatch-wrapper {\n    padding: 0;\n    border-radius: 50%;\n  }\n\n  &::-webkit-color-swatch {\n    border: none;\n    border-radius: 50%;\n  }\n"])), function (props) {
    return props.colorvalue === "#ffffff" ||
        props.colorvalue === "#fff" ||
        props.colorvalue === "#FFFFFF" ||
        props.colorvalue === "#FFF"
        ? "1px solid #000"
        : "none";
});
var ColorField = function (_a) {
    var label = _a.label, name = _a.name, value = _a.value, onChange = _a.onChange;
    return (<div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex justify-end items-center w-[80px] relative gap-2">
        <p className="text-xs font-medium text-left text-black/50">{value}</p>
        <div className="flex justify-start items-center gap-4 rounded-[100px]">
          <StyledColorInput type="color" name={name} value={value} onChange={onChange} colorvalue={value} // Pass the color value as a prop
    />
        </div>
      </div>
    </div>);
};
export default ColorField;
var templateObject_1;
