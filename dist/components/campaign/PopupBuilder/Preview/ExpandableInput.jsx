import React from "react";
var ExpandableInput = function (_a) {
    var name = _a.name, type = _a.type, value = _a.value, placeholder = _a.placeholder, onChange = _a.onChange, isExpanded = _a.isExpanded, onFocus = _a.onFocus, onBlur = _a.onBlur;
    return (<div style={{
            display: "flex",
            alignItems: "center",
            height: "40px",
            position: "relative",
            gap: "10px",
            padding: "8px",
            borderRadius: "10px",
            backgroundColor: "white",
            border: "0.5px solid ".concat(isExpanded ? "blue" : "rgba(0, 0, 0, 0.3)"),
            width: "100%",
            transition: "all 0.2s",
            boxShadow: "none",
            outline: "none",
        }}>
      <input name={name} type={type} value={value} placeholder={placeholder} onChange={onChange} onFocus={onFocus} onBlur={onBlur} style={{
            flexGrow: 1,
            fontSize: "14px",
            textAlign: "left",
            color: "black",
            padding: "8px",
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
        }} required/>
    </div>);
};
export default ExpandableInput;
