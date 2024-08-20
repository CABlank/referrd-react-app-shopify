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
import ColorField from "../../CommonComponents/ColorField";
import TextField from "../../CommonComponents/TextField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
export var initialDesktopConfigStep1 = {
    backgroundColor: "#464ADF",
    height: "50px",
    width: undefined,
};
export var initialDesktopConfigStep2 = {
    backgroundColor: "#464ADF",
    height: "50px",
    width: undefined,
};
export var initialMobileConfigStep1 = {
    backgroundColor: "#464ADF",
    height: "50px",
    width: undefined,
};
export var initialMobileConfigStep2 = {
    backgroundColor: "#464ADF",
    height: "120px",
    width: undefined,
};
var SettingsPanel = function (_a) {
    var isOpen = _a.isOpen, toggleSettings = _a.toggleSettings, config = _a.config, view = _a.view, previewStep = _a.previewStep, setDesktopConfigStep1 = _a.setDesktopConfigStep1, setDesktopConfigStep2 = _a.setDesktopConfigStep2, setMobileConfigStep1 = _a.setMobileConfigStep1, setMobileConfigStep2 = _a.setMobileConfigStep2;
    var handleHeightChange = function (e) {
        var value = e.target.value;
        if (view === "desktop") {
            if (previewStep === 1) {
                setDesktopConfigStep1(function (prevConfig) { return (__assign(__assign({}, prevConfig), { height: "".concat(value, "px") })); });
            }
            else {
                setDesktopConfigStep2(function (prevConfig) { return (__assign(__assign({}, prevConfig), { height: "".concat(value, "px") })); });
            }
        }
        else {
            if (previewStep === 1) {
                setMobileConfigStep1(function (prevConfig) { return (__assign(__assign({}, prevConfig), { height: "".concat(value, "px") })); });
            }
            else {
                setMobileConfigStep2(function (prevConfig) { return (__assign(__assign({}, prevConfig), { height: "".concat(value, "px") })); });
            }
        }
    };
    function handleConfigChange(e) {
        var _a = e.target, name = _a.name, value = _a.value;
        if (view === "desktop") {
            if (previewStep === 1) {
                setDesktopConfigStep1(function (prevConfig) {
                    var _a;
                    return (__assign(__assign({}, prevConfig), (_a = {}, _a[name] = value, _a)));
                });
            }
            else {
                setDesktopConfigStep2(function (prevConfig) {
                    var _a;
                    return (__assign(__assign({}, prevConfig), (_a = {}, _a[name] = value, _a)));
                });
            }
        }
        else {
            if (previewStep === 1) {
                setMobileConfigStep1(function (prevConfig) {
                    var _a;
                    return (__assign(__assign({}, prevConfig), (_a = {}, _a[name] = value, _a)));
                });
            }
            else {
                setMobileConfigStep2(function (prevConfig) {
                    var _a;
                    return (__assign(__assign({}, prevConfig), (_a = {}, _a[name] = value, _a)));
                });
            }
        }
    }
    return (<div className="p-4 bg-white border-b-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleSettings}>
        <h2 className="font-semibold">Customize Top Bar</h2>
        <ArrowDropdownIcon isOpen={isOpen} width={20} height={20}/>
      </div>
      {isOpen && (<div className="mt-4 space-y-4">
          <TextField label="Height" name="height" type="text" value={config.height.replace("px", "")} onChange={handleHeightChange} isMeasurement={true} style={{}}/>
          <ColorField label="Background Color" name="backgroundColor" value={config.backgroundColor} onChange={function (e) { return handleConfigChange(e); }}/>
        </div>)}
    </div>);
};
export default SettingsPanel;
