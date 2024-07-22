import React from "react";
var ExpandableInput = function (_a) {
    var type = _a.type, value = _a.value, placeholder = _a.placeholder, onChange = _a.onChange, isExpanded = _a.isExpanded, onFocus = _a.onFocus, onBlur = _a.onBlur, view = _a.view, icon = _a.icon, error = _a.error;
    return (<div className={"flex justify-start items-center flex-grow-0 flex-shrink-0 h-9 relative gap-2 pl-3 pr-6 py-2.5 rounded-lg border ".concat(error ? "border-red-500" : "border-white")} style={{
            width: view === "desktop" ? "120px" : isExpanded ? "120px" : "40px",
        }} onClick={onFocus}>
      {view === "mobile" && !isExpanded && icon && (<div className="icon-container">{icon}</div>)}
      <input type={type} value={view === "mobile" && !isExpanded ? "" : value} // Adjust this line
     onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder={isExpanded || view === "desktop" ? placeholder : ""} className="bg-transparent text-white outline-none text-base font-regular placeholder-white" style={{ width: "100%" }}/>
      <style jsx>{"\n        .placeholder-white::placeholder {\n          color: white;\n          opacity: 1;\n        }\n        .icon-container {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          margin-right: 8px;\n        }\n      "}</style>
    </div>);
};
export default ExpandableInput;
