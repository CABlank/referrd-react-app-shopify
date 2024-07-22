import React, { useState } from "react";
import ArrowDropdownIcon from "../../Icons/ArrowDropdownIcon";
var SelectField = function (_a) {
    var label = _a.label, name = _a.name, value = _a.value, onChange = _a.onChange, options = _a.options, _b = _a.iconWidth, iconWidth = _b === void 0 ? 15 : _b, _c = _a.iconHeight, iconHeight = _c === void 0 ? 15 : _c;
    var _d = useState(false), isOpen = _d[0], setIsOpen = _d[1];
    var handleSelectClick = function () {
        setIsOpen(!isOpen);
    };
    return (<div className="flex justify-between items-center w-full my-4">
      <p className="text-sm font-medium text-left text-black/50">{label}</p>
      <div className="flex items-center w-[140px] h-9 px-3 rounded-lg bg-white border border-black/30 relative">
        <select name={name} value={value} onChange={onChange} onClick={handleSelectClick} onBlur={function () { return setIsOpen(false); }} className="block w-full appearance-none bg-white border-none text-sm text-left text-black/70 outline-none h-full pr-10">
          {options.map(function (option) { return (<option key={option} value={option}>
              {option}
            </option>); })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ArrowDropdownIcon isOpen={isOpen} width={iconWidth} height={iconHeight}/>
        </div>
      </div>
    </div>);
};
export default SelectField;
