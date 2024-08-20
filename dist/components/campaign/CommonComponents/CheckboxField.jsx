// src/components/CommonComponents/CheckboxField.tsx
import React from "react";
var CheckboxField = function (_a) {
    var label = _a.label, name = _a.name, value = _a.value, onChange = _a.onChange;
    var handleChange = function (e) {
        onChange(e);
    };
    return (<div className="flex justify-between items-center w-full my-">
      <label className="text-sm font-medium text-left text-black/50">
        {label}
      </label>
      <input type="checkbox" name={name} checked={!!value} onChange={handleChange} className="w-[16px] h-[16px] text-black/70 bg-white outline-none border border-black/30 rounded"/>
    </div>);
};
export default CheckboxField;
