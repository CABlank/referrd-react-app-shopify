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
import React from "react";
export var defaultDividerProps = {
    color: "#000000",
    height: 15,
    width: "100%",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
};
var DividerElement = function (props) {
    var _a = __assign(__assign({}, defaultDividerProps), props), color = _a.color, height = _a.height, width = _a.width, marginTop = _a.marginTop, marginRight = _a.marginRight, marginBottom = _a.marginBottom, marginLeft = _a.marginLeft;
    var inlineStyles = {
        backgroundColor: color,
        width: width,
        height: "".concat(height, "px"),
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
    };
    return <div style={inlineStyles}></div>;
};
export default DividerElement;
