var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState, useRef } from "react";
import NameIcon from "../../Icons/IconsBuilder/NameIcon";
import EmailIcon from "../../Icons/IconsBuilder/EmailIcon";
import MobileIcon from "../../Icons/IconsBuilder/MobileIcon";
var InputElement = function (_a) {
    var type = _a.type, value = _a.value, textcolor = _a.textcolor, bordercolor = _a.bordercolor, borderwidth = _a.borderwidth, borderradius = _a.borderradius, onChange = _a.onChange, error = _a.error, view = _a.view, placeholder = _a.placeholder, onExpand = _a.onExpand, expandedId = _a.expandedId, id = _a.id, props = __rest(_a, ["type", "value", "textcolor", "bordercolor", "borderwidth", "borderradius", "onChange", "error", "view", "placeholder", "onExpand", "expandedId", "id"]);
    var _b = useState(value), inputValue = _b[0], setInputValue = _b[1];
    var inputRef = useRef(null);
    var isExpanded = expandedId === id;
    var icon;
    if (id.includes("text")) {
        icon = <NameIcon color={bordercolor}/>;
    }
    else if (id.includes("email")) {
        icon = <EmailIcon color={bordercolor}/>;
    }
    else if (id.includes("tel")) {
        icon = <MobileIcon color={bordercolor}/>;
    }
    var commonStyles = {
        borderColor: bordercolor || "#000000",
        color: textcolor || "#000000",
        backgroundColor: "transparent",
        borderStyle: "solid",
        marginLeft: "5px",
        marginRight: "5px",
        width: "100%",
        padding: "5px",
        fontWeight: "500", // Set font weight to medium (500)
    };
    var collapsedStyles = __assign(__assign({}, commonStyles), { borderWidth: "".concat(borderwidth, "px") || "1px", borderRadius: "".concat(borderradius, "px") || "0px" });
    var expandedStyles = __assign(__assign({}, commonStyles), { borderWidth: "".concat(borderwidth, "px") || "1px", borderRadius: "".concat(borderradius, "px") || "0px" });
    var containerStyles = {
        width: isExpanded ? "120px" : "38px",
        backgroundColor: isExpanded ? "transparent" : "inherit",
        padding: isExpanded ? "0px" : "10px",
        border: isExpanded
            ? "none"
            : "".concat(borderwidth, "px solid ").concat(bordercolor || "#000000"),
        borderRadius: "".concat(borderradius, "px") || "0px", // Apply border radius to the container
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "38px", // Ensure consistent height
    };
    var placeholderStyleId = "input-placeholder-".concat(Math.random().toString(36).substr(2, 9));
    var handleFocus = function () {
        var _a;
        onExpand && onExpand(id);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var handleBlur = function () {
        if (view === "mobile") {
            onExpand && onExpand("");
        }
    };
    var handleChange = function (event) {
        var newValue = event.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(event);
        }
    };
    return (<>
      <style>
        {"\n          .".concat(placeholderStyleId, "::placeholder {\n            color: ").concat(textcolor || "#000000", ";\n            font-weight: 500; // Set font weight to medium for placeholder\n          }\n          .input-container {\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            flex-grow: 0;\n            flex-shrink: 0;\n            height: 38px;\n            position: relative;\n            gap: 8px;\n            margin: 4px;\n            padding: 0 12px;\n            border-radius: 8px;\n          }\n          .input-container.error {\n            border-color: red;\n          }\n          .icon-container {\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 100%;\n          }\n        ")}
      </style>
      {view === "mobile" ? (<div className={"input-container ".concat(error ? "error" : "")} style={containerStyles} onClick={!isExpanded ? handleFocus : undefined}>
          {!isExpanded && icon && <div className="icon-container">{icon}</div>}
          <input required ref={inputRef} type={type} value={inputValue} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder} style={__assign(__assign({}, (isExpanded ? expandedStyles : collapsedStyles)), { display: isExpanded ? "block" : "none" })} className={placeholderStyleId} {...props}/>
        </div>) : (<input required ref={inputRef} type={type} value={inputValue} onChange={handleChange} placeholder={placeholder} style={__assign(__assign({}, commonStyles), { borderWidth: "".concat(borderwidth, "px"), borderRadius: "".concat(borderradius, "px"), width: "120px" })} className={placeholderStyleId} {...props}/>)}
    </>);
};
export default InputElement;
