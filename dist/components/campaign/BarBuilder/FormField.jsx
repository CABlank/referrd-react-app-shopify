import React from "react";
import ColorField from "../CommonComponents/ColorField";
import SelectField from "../CommonComponents/SelectField";
import SpacingField from "../CommonComponents/SpacingField";
import NumberField from "../CommonComponents/NumberField";
import TextField from "../CommonComponents/TextField";
var FormField = function (_a) {
    var label = _a.label, name = _a.name, type = _a.type, value = _a.value, onChange = _a.onChange, onBatchChange = _a.onBatchChange, options = _a.options;
    if (!name) {
        console.error("FormField is missing the 'name' prop", {
            label: label,
            type: type,
            value: value,
            options: options,
        });
        return null; // Prevent rendering without a name
    }
    switch (type) {
        case "select":
            return (<SelectField label={label} name={name} value={value} onChange={onChange} options={options || []}/>);
        case "color":
            return (<ColorField label={label} name={name} value={value} onChange={onChange}/>);
        case "padding":
        case "margin":
            var spacingValue = typeof value === "string" ? {} : value || {};
            return (<SpacingField label={label} name={name} type={type} value={typeof value === "object" ? value : {}} onChange={onBatchChange}/>);
        case "number":
            return (<NumberField label={label} name={name} value={value !== undefined ? value : 0} onChange={onChange} type={""}/>);
        default:
            return (<TextField label={label} name={name} type={type} value={value} onChange={onChange}/>);
    }
};
export default FormField;
