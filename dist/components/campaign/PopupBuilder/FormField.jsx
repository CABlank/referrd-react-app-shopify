import React from "react";
import ColorField from "../CommonComponents/ColorField";
import SelectField from "../CommonComponents/SelectField";
import SpacingField from "../CommonComponents/SpacingField";
import NumberField from "../CommonComponents/NumberField";
import TextField from "../CommonComponents/TextField";
import CheckboxField from "../CommonComponents/CheckboxField";
import PercentageField from "../CommonComponents/PercentageField";
var FormField = function (_a) {
    var label = _a.label, name = _a.name, type = _a.type, value = _a.value, onChange = _a.onChange, options = _a.options, onBatchChange = _a.onBatchChange;
    var isMeasurementField = [
        "imageWidth",
        "imageHeight",
        "borderRadius",
    ].includes(name);
    switch (type) {
        case "select":
            return (<SelectField label={label} name={name} value={value} onChange={onChange} options={options || []}/>);
        case "color":
            return (<ColorField label={label} name={name} value={value} onChange={onChange}/>);
        case "padding":
        case "margin":
            return (<SpacingField label={label} name={name} type={type} value={typeof value === "object" ? value : {}} onChange={onBatchChange}/>);
        case "number":
            return (<NumberField label={label} name={name} value={typeof value === "number" ? value : parseInt(value, 10)} onChange={onChange} type={""}/>);
        case "checkbox":
            return (<CheckboxField label={label} name={name} value={value} onChange={onChange} type={""}/>);
        case "percentage":
            return (<PercentageField label={label} name={name} type={type} value={value} onChange={onChange} isMeasurement={isMeasurementField}/>);
        default:
            return (<TextField label={label} name={name} type={type} value={value} onChange={onChange} isMeasurement={isMeasurementField}/>);
    }
};
export default FormField;
