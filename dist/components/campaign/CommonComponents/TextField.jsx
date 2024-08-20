import React from "react";
var TextField = function (_a) {
    var label = _a.label, name = _a.name, type = _a.type, value = _a.value, onChange = _a.onChange, _b = _a.isMeasurement, isMeasurement = _b === void 0 ? false : _b;
    var handleChange = function (e) {
        onChange(e);
    };
    return (<div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30">
        <input type={type} name={name} value={typeof value === "object" ? "" : value} onChange={handleChange} className="w-full h-full text-sm text-left text-black/70 bg-white outline-none"/>
        {isMeasurement && (<span className="ml-2 text-sm text-left text-black/50">px</span>)}
      </div>
    </div>);
};
export default TextField;
