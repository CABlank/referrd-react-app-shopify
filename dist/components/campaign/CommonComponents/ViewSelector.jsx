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
// src/components/campaign/CommonComponents/ViewSelector.tsx
import React from "react";
import DesktopViewIcon from "../../Icons/IconsBuilder/DesktopViewIcon";
import MobileViewIcon from "../../Icons/IconsBuilder/MobileViewIcon";
var ViewSelector = function (_a) {
    var view = _a.view, setView = _a.setView, previewStep = _a.previewStep, setDesktopConfigStep1 = _a.setDesktopConfigStep1, setDesktopConfigStep2 = _a.setDesktopConfigStep2, setMobileConfigStep1 = _a.setMobileConfigStep1, setMobileConfigStep2 = _a.setMobileConfigStep2;
    var handleConfigChange = function (e) {
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
    };
    return (<div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4 p-4 border-b-2">
      <p className="self-stretch flex-grow-0 flex-shrink-0 font-medium text-left">
        Select a View
      </p>
      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <div onClick={function () { return setView("desktop"); }} className={"flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-8 w-[50px] relative overflow-hidden gap-2.5 px-0.5 py-[3px] rounded ".concat(view === "desktop"
            ? "bg-[#10ad1b]/[0.15] border border-[#10ad1b]"
            : "border border-[#a8a8a8]", " cursor-pointer")}>
          <DesktopViewIcon selected={view === "desktop"}/>
        </div>
        <div onClick={function () { return setView("mobile"); }} className={"flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-8 w-[50px] relative overflow-hidden gap-2.5 px-0.5 py-[3px] rounded ".concat(view === "mobile"
            ? "bg-[#10ad1b]/[0.15] border border-[#10ad1b]"
            : "border border-[#a8a8a8]", " cursor-pointer")}>
          <MobileViewIcon selected={view === "mobile"}/>
        </div>
      </div>
    </div>);
};
export default ViewSelector;
