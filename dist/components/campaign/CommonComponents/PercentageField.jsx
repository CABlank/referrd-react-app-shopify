import React from "react";
var PercentageField = function (_a) {
    var _b;
    var label = _a.label, name = _a.name, type = _a.type, value = _a.value, onChange = _a.onChange;
    var handleChange = function (e) {
        onChange(e);
    };
    return (<div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30">
        <input type={type} name={name} value={(_b = value) !== null && _b !== void 0 ? _b : ""} onChange={handleChange} className="w-full h-full text-sm text-left text-black/70 bg-white outline-none"/>
        <span className="ml-2 text-sm text-left text-black/50">%</span>
      </div>
    </div>);
};
export default PercentageField;
