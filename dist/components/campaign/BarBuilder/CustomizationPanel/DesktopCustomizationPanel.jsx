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
import React, { useState } from "react";
import FormField from "../FormField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import TrashIcon from "../../../Icons/IconsBuilder/TrashIcon";
import fieldConfigs from "./FieldConfigs.json";
var DesktopCustomizationPanel = function (_a) {
    var elements = _a.elements, onUpdate = _a.onUpdate, onRemove = _a.onRemove;
    var _b = useState(null), openElementId = _b[0], setOpenElementId = _b[1];
    var handleChange = function (e, element) {
        var _a;
        var _b = e.target, _c = _b.name, name = _c === void 0 ? "" : _c, value = _b.value;
        var parsedValue = (name === "buttonBorderWidth" || name === "buttonBorderRadius") &&
            value !== ""
            ? parseInt(value, 10).toString()
            : value;
        onUpdate(__assign(__assign({}, element), (_a = {}, _a[name] = parsedValue, _a)));
    };
    var handleBatchChange = function (updatedValues, element) {
        var updatedElement = __assign(__assign({}, element), updatedValues);
        onUpdate(updatedElement);
    };
    var toggleElement = function (elementId) {
        setOpenElementId(openElementId === elementId ? null : elementId);
    };
    var getFieldValue = function (element, field) {
        var _a;
        return (_a = element[field]) !== null && _a !== void 0 ? _a : "";
    };
    // Type guard to check if the element type is allowed
    var isAllowedElementType = function (type) {
        return ["text", "button"].includes(type);
    };
    return (<div className="p-4 bg-white rounded-lg mb-4">
      <h2 className="font-semibold">Customize Elements</h2>
      {elements
            .filter(function (element) { return element && element.id; })
            .map(function (element, index) {
            var _a;
            return (<div key={element === null || element === void 0 ? void 0 : element.id} className="mt-4">
            <div className="flex justify-between items-center cursor-pointer py-2 bg-white mb-4" onClick={function () { return element && toggleElement(element.id); }}>
              <div className="flex items-center w-full">
                <h3 className="text-base font-medium flex items-center">
                  <span className="ml-1 capitalize">{element === null || element === void 0 ? void 0 : element.type}</span>
                </h3>
                <button className="text-red-500 flex items-center ml-2" onClick={function (e) {
                    e.stopPropagation();
                    if (element) {
                        onRemove(element.id);
                    }
                }}>
                  <TrashIcon />
                </button>
              </div>
              <div className="flex items-center">
                <ArrowDropdownIcon isOpen={openElementId === (element === null || element === void 0 ? void 0 : element.id)} width={20} height={20}/>
              </div>
            </div>
            {openElementId === (element === null || element === void 0 ? void 0 : element.id) &&
                    isAllowedElementType(element.type) && (<div className="space-y-4">
                  {(_a = fieldConfigs[element.type]) === null || _a === void 0 ? void 0 : _a.map(function (field) { return (<FormField key={field.name} label={field.label} name={field.name} type={field.type} value={getFieldValue(element, field.name)} onChange={function (e) { return handleChange(e, element); }} onBatchChange={field.type === "margin" || field.type === "padding"
                            ? function (updatedValues) {
                                return handleBatchChange(updatedValues, element);
                            }
                            : undefined} options={field.options}/>); })}
                </div>)}
          </div>);
        })}
    </div>);
};
export default DesktopCustomizationPanel;
