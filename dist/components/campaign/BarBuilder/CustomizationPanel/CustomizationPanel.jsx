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
import { defaultTextProps } from "../../CommonComponents/TextElement";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import fieldConfigs from "./FieldConfigs.json";
var isAllowedElementType = function (type) {
    return ["text", "button", "input"].includes(type);
};
var CustomizationPanel = function (_a) {
    var view = _a.view, elements = _a.elements, onUpdate = _a.onUpdate, onRemove = _a.onRemove;
    var _b = useState(null), openElementId = _b[0], setOpenElementId = _b[1];
    var handleChange = function (e, element) {
        var _a;
        if (!e.target || !e.target.name) {
            console.error("Event target or target name is undefined", e);
            return;
        }
        var _b = e.target, name = _b.name, value = _b.value;
        var parsedValue = name === "buttonBorderWidth" || name === "buttonBorderRadius"
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
        return ((_a = element === null || element === void 0 ? void 0 : element[field]) !== null && _a !== void 0 ? _a : ((element === null || element === void 0 ? void 0 : element.type) === "text"
            ? defaultTextProps[field]
            : (element === null || element === void 0 ? void 0 : element.type) === "button"
                ? defaultButtonProps[field]
                : [field]));
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
                  {(_a = fieldConfigs[element.type]) === null || _a === void 0 ? void 0 : _a.map(function (field) {
                        // Hide buttonLink field only for preloaded buttons
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
