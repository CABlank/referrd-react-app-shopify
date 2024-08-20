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
import React, { useState, useEffect } from "react";
import FormField from "../FormField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import TrashIcon from "../../../Icons/IconsBuilder/TrashIcon";
import ImageUpload from "../../CommonComponents/ImageUpload";
import fieldConfigs from "./FieldConfigs.json";
var defaultTextProps = {
    text: "Default Text",
    fontFamily: "Arial",
    fontSize: "16px",
    textColor: "#000000",
    textTransform: "none",
    fontWeight: "normal",
    letterSpacing: "normal",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
};
var defaultButtonProps = {
    buttonText: "Join Us",
    buttonLink: "#",
    buttonBackgroundColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorderColor: "#555555",
    buttonBorderWidth: 1,
    buttonBorderRadius: 8,
    paddingTop: "8px",
    paddingRight: "24px",
    paddingBottom: "8px",
    paddingLeft: "24px",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    fontFamily: "Arial",
    fontSize: "14px",
    textAlign: "center",
    textTransform: "none",
    fontWeight: "bold",
    letterSpacing: "normal",
    lineHeight: "normal",
    hoverBackgroundColor: "#ffffff",
    hoverTextColor: "#000000",
    hoverBorderColor: "#555555",
    buttonAlign: "center",
};
var defaultDividerProps = {
    color: "#000000",
    height: 1,
    width: "100%",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
};
var defaultImageProps = {
    imageUrl: "",
    imageWidth: "100px",
    imageHeight: "100px",
    borderRadius: "0px",
    objectFit: "cover",
    centerImage: false,
};
var isAllowedElementType = function (type) {
    return ["text", "button", "input", "divider", "image"].includes(type);
};
var CustomizationPanel = function (_a) {
    var view = _a.view, elements = _a.elements, onUpdate = _a.onUpdate, onRemove = _a.onRemove, imageRecentlyAdded = _a.imageRecentlyAdded, setImageRecentlyAdded = _a.setImageRecentlyAdded;
    var _b = useState(null), openElementId = _b[0], setOpenElementId = _b[1];
    useEffect(function () {
        if (imageRecentlyAdded) {
            var imageElement = elements.find(function (element) { return element.type === "image"; });
            if (imageElement) {
                setOpenElementId(imageElement.id);
            }
            setImageRecentlyAdded(false);
        }
    }, [elements, imageRecentlyAdded, setImageRecentlyAdded]);
    var handleChange = function (e, element) {
        var _a;
        if (!e.target || !e.target.name) {
            console.error("Event target or target name is undefined", e);
            return;
        }
        var _b = e.target, name = _b.name, value = _b.value, type = _b.type;
        var parsedValue = value;
        if (type === "number") {
            parsedValue =
                value === "" || isNaN(parseInt(value, 10))
                    ? defaultButtonProps[name] ||
                        0
                    : parseInt(value, 10);
            parsedValue = parsedValue.toString(); // Ensure parsedValue is a string
        }
        else if (type === "color" && value === "") {
            parsedValue = "#000000"; // or any default color value
        }
        else if (type === "checkbox") {
            parsedValue = e.target.checked ? 1 : 0;
        }
        onUpdate(__assign(__assign({}, element), (_a = {}, _a[name] = parsedValue, _a)));
    };
    var handleBatchChange = function (updatedValues, element) {
        var updatedElement = __assign(__assign({}, element), updatedValues);
        onUpdate(updatedElement);
    };
    var handleImageChange = function (file, element) {
        if (file) {
            var reader_1 = new FileReader();
            reader_1.onloadend = function () {
                if (element.type === "image") {
                    onUpdate(__assign(__assign({}, element), { imageUrl: reader_1.result })); // Correct property name
                }
            };
            reader_1.readAsDataURL(file);
        }
    };
    var handleRemoveImage = function (element) {
        if (element.type === "image") {
            onUpdate(__assign(__assign({}, element), { imageUrl: "" })); // Correct property name
        }
    };
    var toggleElement = function (elementId) {
        setOpenElementId(openElementId === elementId ? null : elementId);
    };
    var getFieldValue = function (element, field) {
        var _a, _b, _c, _d, _e;
        switch (element.type) {
            case "text":
                return ((_a = element[field]) !== null && _a !== void 0 ? _a : defaultTextProps[field]);
            case "button":
                return ((_b = element[field]) !== null && _b !== void 0 ? _b : defaultButtonProps[field]);
            case "divider":
                return ((_c = element[field]) !== null && _c !== void 0 ? _c : defaultDividerProps[field]);
            case "image":
                return ((_d = element[field]) !== null && _d !== void 0 ? _d : defaultImageProps[field]);
            default:
                return (_e = element === null || element === void 0 ? void 0 : element[field]) !== null && _e !== void 0 ? _e : "";
        }
    };
    return (<div className="p-4 bg-white rounded-lg mb-4">
      <h2 className="font-semibold">Customize Elements</h2>
      {elements.map(function (element) {
            var _a;
            if (!element || !("id" in element)) {
                console.error("Invalid element:", element);
                return null;
            }
            return (<div key={element.id} className="mt-4">
            <div className="flex justify-between items-center cursor-pointer p-2 bg-white mb-4" onClick={function () { return toggleElement(element.id); }}>
              <div className="flex items-center w-full">
                <h3 className="text-sm font-medium flex items-center">
                  <span className="ml-1 capitalize">{element.type}</span>
                </h3>
                {element.type === "button" &&
                    element
                        .isPreloaded ? null : element.type === "input" ? null : (<button className="text-red-500 flex items-center ml-2" onClick={function (e) {
                        e.stopPropagation();
                        onRemove(element.id);
                    }}>
                    <TrashIcon />
                  </button>)}
              </div>
              <div className="flex items-center">
                <ArrowDropdownIcon isOpen={openElementId === element.id} width={20} height={20}/>
              </div>
            </div>
            {openElementId === element.id &&
                    isAllowedElementType(element.type) && (<div className="space-y-4">
                  {element.type === "image" ? (<div className="image-options">
                      <label className="block text-sm font-medium text-black/50 mt-4 my-2">
                        Upload Image
                      </label>
                      <ImageUpload imageUrl={element.imageUrl || ""} // Correct property name
                     onImageChange={function (file) {
                            return handleImageChange(file, element);
                        }} onRemoveImage={function () { return handleRemoveImage(element); }}/>
                    </div>) : null}
                  {(_a = fieldConfigs[element.type]) === null || _a === void 0 ? void 0 : _a.map(function (field) {
                        if (element.type === "button" &&
                            field.name === "buttonLink" &&
                            element.isPreloaded) {
                            return null;
                        }
                        return (<FormField key={field.name} label={field.label} name={field.name} type={field.type} value={getFieldValue(element, field.name)} onChange={function (e) { return handleChange(e, element); }} onBatchChange={field.type === "margin" || field.type === "padding"
                                ? function (updatedValues) {
                                    return handleBatchChange(updatedValues, element);
                                }
                                : undefined} options={"options" in field ? field.options : undefined}/>);
                    })}
                </div>)}
          </div>);
        })}
    </div>);
};
export default CustomizationPanel;
