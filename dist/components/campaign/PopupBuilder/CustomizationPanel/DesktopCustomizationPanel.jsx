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
import fieldConfigs from "./FieldConfigs.json";
import ImageUpload from "../../CommonComponents/ImageUpload";
var DesktopCustomizationPanel = function (_a) {
    var elements = _a.elements, onUpdate = _a.onUpdate, onRemove = _a.onRemove, imageRecentlyAdded = _a.imageRecentlyAdded, setImageRecentlyAdded = _a.setImageRecentlyAdded;
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
        var _b = e.target, name = _b.name, value = _b.value, type = _b.type;
        var updatedValue = type === "checkbox" ? e.target.checked : value;
        onUpdate(__assign(__assign({}, element), (_a = {}, _a[name] = updatedValue, _a)));
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
                    onUpdate(__assign(__assign({}, element), { imageUrl: reader_1.result }));
                }
            };
            reader_1.readAsDataURL(file);
        }
    };
    var handleRemoveImage = function (element) {
        if (element.type === "image") {
            onUpdate(__assign(__assign({}, element), { imageUrl: "" }));
        }
    };
    var toggleElement = function (element) {
        setOpenElementId(openElementId === element.id ? null : element.id);
    };
    var getFieldValue = function (element, field) {
        var _a;
        return (_a = element[field]) !== null && _a !== void 0 ? _a : "";
    };
    var renderFormFields = function (element) {
        return fieldConfigs[element.type].map(function (field) { return (<FormField key={field.name} label={field.label} name={field.name} type={field.type} value={getFieldValue(element, field.name)} onChange={function (e) { return handleChange(e, element); }} onBatchChange={field.type === "margin" || field.type === "padding"
                ? function (updatedValues) {
                    return handleBatchChange(updatedValues, element);
                }
                : undefined // Do not use onBatchChange for single field updates
            } options={field.options ? field.options : undefined} style={element.type === "image"
                ? { paddingTop: "4px", paddingBottom: "4px" }
                : undefined}/>); });
    };
    return (<div className="p-4 bg-white rounded-lg mb-4">
      <h2 className="font-semibold">Customize Elements</h2>
      {elements.map(function (element) { return (<div key={element.id} className="mt-4">
          <div className="flex justify-between items-center cursor-pointer py-2 bg-white" onClick={function () { return toggleElement(element); }}>
            <div className="flex items-center w-full">
              <h3 className="text-base font-medium flex items-center">
                <span className="ml-1 capitalize">{element.type}</span>
              </h3>
              <button className="text-red-500 flex items-center ml-2" onClick={function (e) {
                e.stopPropagation();
                onRemove(element.id);
            }}>
                <TrashIcon />
              </button>
            </div>
            <div className="flex items-center">
              <ArrowDropdownIcon isOpen={openElementId === element.id} width={20} height={20}/>
            </div>
          </div>
          {openElementId === element.id && (<div className="space-y-4">
              {element.type === "image" ? (<div className="image-options">
                  <label className="block text-sm font-medium text-black/50 mt-4 my-2">
                    Upload Image
                  </label>
                  <ImageUpload imageUrl={element.imageUrl || ""} onImageChange={function (file) { return handleImageChange(file, element); }} onRemoveImage={function () { return handleRemoveImage(element); }}/>
                  {renderFormFields(element)}
                </div>) : (renderFormFields(element))}
            </div>)}
        </div>); })}
    </div>);
};
export default DesktopCustomizationPanel;
