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
var ImageElement = function (_a) {
    var imageUrl = _a.imageUrl, _b = _a.imageWidth, imageWidth = _b === void 0 ? "100%" : _b, _c = _a.imageHeight, imageHeight = _c === void 0 ? "100%" : _c, _d = _a.borderRadius, borderRadius = _d === void 0 ? "0" : _d, _e = _a.objectFit, objectFit = _e === void 0 ? "cover" : _e, _f = _a.centerImage, centerImage = _f === void 0 ? false : _f, props = __rest(_a, ["imageUrl", "imageWidth", "imageHeight", "borderRadius", "objectFit", "centerImage"]);
    var processedImageWidth = imageWidth.includes("%")
        ? imageWidth
        : "".concat(imageWidth, "%");
    var processedImageHeight = imageHeight.includes("%")
        ? imageHeight
        : "".concat(imageHeight, "%");
    var style = {
        width: processedImageWidth,
        height: processedImageHeight,
        borderRadius: "".concat(borderRadius, "px"),
        objectFit: objectFit,
        display: centerImage ? "block" : "inline-block",
        margin: centerImage ? "0 auto" : "initial",
    };
    return <img src={imageUrl} alt="Image" style={style} {...props}/>;
};
export var defaultImageProps = {
    imageWidth: "100%",
    imageHeight: "100%",
    borderRadius: "0",
    objectFit: "cover",
    centerImage: false,
};
export default ImageElement;
