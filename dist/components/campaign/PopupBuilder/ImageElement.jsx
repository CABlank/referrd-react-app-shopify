var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import styled from "styled-components";
var StyledImage = styled.img(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: ", ";\n  height: ", ";\n  border-radius: ", ";\n  object-fit: ", ";\n  display: ", ";\n  margin: ", ";\n"], ["\n  width: ", ";\n  height: ", ";\n  border-radius: ", ";\n  object-fit: ", ";\n  display: ", ";\n  margin: ", ";\n"])), function (_a) {
    var imageWidth = _a.imageWidth;
    return imageWidth || "100%";
}, function (_a) {
    var imageHeight = _a.imageHeight;
    return imageHeight || "100%";
}, function (_a) {
    var borderRadius = _a.borderRadius;
    return "".concat(borderRadius, "px") || "0";
}, function (_a) {
    var objectFit = _a.objectFit;
    return objectFit || "cover";
}, function (_a) {
    var centerImage = _a.centerImage;
    return (centerImage ? "block" : "inline-block");
}, function (_a) {
    var centerImage = _a.centerImage;
    return (centerImage ? "0 auto" : "initial");
});
var ImageElement = function (_a) {
    var _b, _c;
    var imageUrl = _a.imageUrl, props = __rest(_a, ["imageUrl"]);
    var processedProps = __assign(__assign({}, props), { imageWidth: ((_b = props.imageWidth) === null || _b === void 0 ? void 0 : _b.includes("%"))
            ? props.imageWidth
            : "".concat(props.imageWidth, "%"), imageHeight: ((_c = props.imageHeight) === null || _c === void 0 ? void 0 : _c.includes("%"))
            ? props.imageHeight
            : "".concat(props.imageHeight, "%") });
    return <StyledImage src={imageUrl} alt="Image" {...processedProps}/>;
};
export default ImageElement;
var templateObject_1;
