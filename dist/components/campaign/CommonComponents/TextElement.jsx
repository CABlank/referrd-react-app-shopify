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
export var defaultTextProps = {
    text: "Refer friends and get exclusive discounts!",
    fontFamily: "Arial",
    fontSize: "16",
    textColor: "#FFFFFF",
    textTransform: "none",
    fontWeight: "normal",
    letterSpacing: "normal",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
};
var TextElement = function (props) {
    var _a = __assign(__assign({}, defaultTextProps), props), text = _a.text, fontFamily = _a.fontFamily, fontSize = _a.fontSize, textColor = _a.textColor, textTransform = _a.textTransform, fontWeight = _a.fontWeight, letterSpacing = _a.letterSpacing, marginTop = _a.marginTop, marginRight = _a.marginRight, marginBottom = _a.marginBottom, marginLeft = _a.marginLeft;
    var inlineStyles = {
        fontFamily: fontFamily,
        fontSize: "".concat(fontSize, "px"),
        color: textColor,
        textTransform: textTransform,
        fontWeight: fontWeight,
        letterSpacing: letterSpacing,
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        display: "flex",
        alignItems: "center",
        height: "100%",
    };
    return <div style={inlineStyles}>{text}</div>;
};
export default TextElement;
