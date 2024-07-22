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
import React from "react";
export var defaultButtonProps = {
    buttonText: "Button",
    buttonLink: "#",
    buttonBackgroundColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorderColor: "#555555",
    buttonBorderWidth: 1,
    buttonBorderRadius: 8,
    paddingTop: "4px",
    paddingRight: "16px",
    paddingBottom: "4px",
    paddingLeft: "16px",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    fontFamily: "Arial",
    fontSize: "14",
    textTransform: "none",
    fontWeight: "normal",
    letterSpacing: "normal",
    lineHeight: "normal",
    hoverBackgroundColor: "#ffffff",
    hoverTextColor: "#000000",
    hoverBorderColor: "#555555",
};
var ButtonElement = function (_a) {
    var buttonText = _a.buttonText, buttonLink = _a.buttonLink, _b = _a.buttonAlign, buttonAlign = _b === void 0 ? "center" : _b, props = __rest(_a, ["buttonText", "buttonLink", "buttonAlign"]);
    var _c = __assign(__assign({}, defaultButtonProps), props), buttonBackgroundColor = _c.buttonBackgroundColor, buttonTextColor = _c.buttonTextColor, buttonBorderColor = _c.buttonBorderColor, buttonBorderWidth = _c.buttonBorderWidth, buttonBorderRadius = _c.buttonBorderRadius, paddingTop = _c.paddingTop, paddingRight = _c.paddingRight, paddingBottom = _c.paddingBottom, paddingLeft = _c.paddingLeft, marginTop = _c.marginTop, marginRight = _c.marginRight, marginBottom = _c.marginBottom, marginLeft = _c.marginLeft, fontFamily = _c.fontFamily, fontSize = _c.fontSize, textTransform = _c.textTransform, fontWeight = _c.fontWeight, letterSpacing = _c.letterSpacing, lineHeight = _c.lineHeight, hoverBackgroundColor = _c.hoverBackgroundColor, hoverTextColor = _c.hoverTextColor, hoverBorderColor = _c.hoverBorderColor;
    var inlineStyles = {
        display: "inline-block",
        backgroundColor: buttonBackgroundColor,
        color: buttonTextColor,
        border: "".concat(buttonBorderWidth, "px solid ").concat(buttonBorderColor),
        borderRadius: "".concat(buttonBorderRadius, "px"),
        padding: "".concat(paddingTop, " ").concat(paddingRight, " ").concat(paddingBottom, " ").concat(paddingLeft),
        margin: "".concat(marginTop, " ").concat(marginRight, " ").concat(marginBottom, " ").concat(marginLeft),
        fontFamily: fontFamily,
        fontSize: "".concat(fontSize, "px"),
        textTransform: textTransform,
        fontWeight: fontWeight,
        letterSpacing: letterSpacing,
        lineHeight: lineHeight,
        textDecoration: "none",
        textAlign: buttonAlign,
    };
    var hoverStyles = {
        backgroundColor: hoverBackgroundColor,
        color: hoverTextColor,
        borderColor: hoverBorderColor,
    };
    return (<a href={buttonLink} style={inlineStyles} onMouseOver={function (e) {
            Object.assign(e.currentTarget.style, hoverStyles);
        }} onMouseOut={function (e) {
            Object.assign(e.currentTarget.style, inlineStyles);
        }}>
      {buttonText}
    </a>);
};
export default ButtonElement;
