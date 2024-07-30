import React from "react";
var ExpandableInput = function (_a) {
    var type = _a.type, value = _a.value, placeholder = _a.placeholder, onChange = _a.onChange, isExpanded = _a.isExpanded, onFocus = _a.onFocus, onBlur = _a.onBlur;
    return (<div className={"flex items-center h-10 relative gap-2.5 p-2 rounded-lg bg-white border-[0.5px] w-full ".concat(isExpanded ? "border-blue-500" : "border-black/30", " transition-all duration-200")}>
      <input type={type} value={value} placeholder={placeholder} onChange={onChange} onFocus={onFocus} onBlur={onBlur} className="flex-grow text-sm text-left text-black placeholder-black/50 p-2 outline-none" required/>
    </div>);
};
export default ExpandableInput;
