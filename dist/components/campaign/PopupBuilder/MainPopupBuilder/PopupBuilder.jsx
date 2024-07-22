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
import React, { useState, forwardRef, useImperativeHandle, useEffect, } from "react";
import DragAndDropSection from "../DragAndDropSection";
import DesktopCustomizationPanel from "../CustomizationPanel/DesktopCustomizationPanel";
import MobileCustomizationPanel from "../CustomizationPanel/MobileCustomizationPanel";
import PopupPreview from "../Preview/PopupPreview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ViewSelector from "../../CommonComponents/ViewSelector";
import StepSelector from "../../CommonComponents/StepSelector";
import SettingsPanel, { initialDesktopConfigStep1, initialDesktopConfigStep2, initialMobileConfigStep1, initialMobileConfigStep2, } from "./SettingsPanel";
var initialElements = [];
var PopupBuilder = forwardRef(function (_a, ref) {
    var className = _a.className, campaign = _a.campaign;
    var _b = useState("desktop"), view = _b[0], setView = _b[1];
    var _c = useState(true), isSettingsOpen = _c[0], setIsSettingsOpen = _c[1];
    var _d = useState(1), step = _d[0], setStep = _d[1];
    var _e = useState(initialElements), desktopStepOneElements = _e[0], setDesktopStepOneElements = _e[1];
    var _f = useState(initialElements), desktopStepTwoElements = _f[0], setDesktopStepTwoElements = _f[1];
    var _g = useState(initialElements), mobileStepOneElements = _g[0], setMobileStepOneElements = _g[1];
    var _h = useState(initialElements), mobileStepTwoElements = _h[0], setMobileStepTwoElements = _h[1];
    var _j = useState(initialDesktopConfigStep1), desktopConfigStep1 = _j[0], setDesktopConfigStep1 = _j[1];
    var _k = useState(initialDesktopConfigStep2), desktopConfigStep2 = _k[0], setDesktopConfigStep2 = _k[1];
    var _l = useState(initialMobileConfigStep1), mobileConfigStep1 = _l[0], setMobileConfigStep1 = _l[1];
    var _m = useState(initialMobileConfigStep2), mobileConfigStep2 = _m[0], setMobileConfigStep2 = _m[1];
    var _o = useState(false), imageRecentlyAdded = _o[0], setImageRecentlyAdded = _o[1];
    var handleElementUpdate = function (updatedElement) {
        var elements = view === "desktop"
            ? step === 1
                ? desktopStepOneElements
                : desktopStepTwoElements
            : step === 1
                ? mobileStepOneElements
                : mobileStepTwoElements;
        var setElements = view === "desktop"
            ? step === 1
                ? setDesktopStepOneElements
                : setDesktopStepTwoElements
            : step === 1
                ? setMobileStepOneElements
                : setMobileStepTwoElements;
        setElements(elements.map(function (element) {
            return element.id === updatedElement.id ? updatedElement : element;
        }));
    };
    var handleConfigChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        if (view === "desktop") {
            var setConfig = step === 1 ? setDesktopConfigStep1 : setDesktopConfigStep2;
            setConfig(function (prevConfig) {
                var _a;
                return (__assign(__assign({}, prevConfig), (_a = {}, _a[name] = value, _a)));
            });
        }
        else {
            var setConfig = step === 1 ? setMobileConfigStep1 : setMobileConfigStep2;
            setConfig(function (prevConfig) {
                var _a;
                return (__assign(__assign({}, prevConfig), (_a = {}, _a[name] = value, _a)));
            });
        }
    };
    var handleValueChange = function (e, type) {
        var value = e.target.value;
        if (view === "desktop") {
            var setConfig = step === 1 ? setDesktopConfigStep1 : setDesktopConfigStep2;
            setConfig(function (prevConfig) {
                var _a;
                return (__assign(__assign({}, prevConfig), (_a = {}, _a[type] = "".concat(value, "px"), _a)));
            });
        }
        else {
            var setConfig = step === 1 ? setMobileConfigStep1 : setMobileConfigStep2;
            setConfig(function (prevConfig) {
                var _a;
                return (__assign(__assign({}, prevConfig), (_a = {}, _a[type] = "".concat(value, "px"), _a)));
            });
        }
    };
    var toggleSettings = function () {
        setIsSettingsOpen(!isSettingsOpen);
    };
    var handleRemoveElement = function (elementId) {
        var elements = view === "desktop"
            ? step === 1
                ? desktopStepOneElements
                : desktopStepTwoElements
            : step === 1
                ? mobileStepOneElements
                : mobileStepTwoElements;
        var setElements = view === "desktop"
            ? step === 1
                ? setDesktopStepOneElements
                : setDesktopStepTwoElements
            : step === 1
                ? setMobileStepOneElements
                : setMobileStepTwoElements;
        setElements(function (prevElements) {
            return prevElements.filter(function (element) { return element.id !== elementId; });
        });
    };
    var handleImageAdd = function () {
        setIsSettingsOpen(false);
        setImageRecentlyAdded(true);
    };
    var currentConfig = view === "desktop"
        ? step === 1
            ? desktopConfigStep1
            : desktopConfigStep2
        : step === 1
            ? mobileConfigStep1
            : mobileConfigStep2;
    // Deserialization on mount
    useEffect(function () {
        if (campaign.serializedPopupState) {
            console.log("Serialized Popup State provided:", campaign.serializedPopupState);
            var serializedState = JSON.parse(campaign.serializedPopupState);
            console.log("Parsed Serialized State:", serializedState);
            if (serializedState) {
                setDesktopStepOneElements(serializedState.desktopStepOneElements);
                setDesktopStepTwoElements(serializedState.desktopStepTwoElements);
                setMobileStepOneElements(serializedState.mobileStepOneElements);
                setMobileStepTwoElements(serializedState.mobileStepTwoElements);
                setStep(serializedState.step);
                setView(serializedState.view);
            }
        }
        if (campaign.settingsPopupState) {
            console.log("Settings Popup State provided:", campaign.settingsPopupState);
            var settingsState = JSON.parse(campaign.settingsPopupState);
            console.log("Parsed Settings State:", settingsState);
            if (settingsState) {
                setDesktopConfigStep1(settingsState.desktopStep1 || initialDesktopConfigStep1);
                setDesktopConfigStep2(settingsState.desktopStep2 || initialDesktopConfigStep2);
                setMobileConfigStep1(settingsState.mobileStep1 || initialMobileConfigStep1);
                setMobileConfigStep2(settingsState.mobileStep2 || initialMobileConfigStep2);
            }
        }
    }, [campaign.serializedPopupState, campaign.settingsPopupState]);
    // Serialization and Deserialization methods
    useImperativeHandle(ref, function () { return ({
        serializeRealPopUp: function () {
            var state = {
                desktopStepOneElements: desktopStepOneElements,
                desktopStepTwoElements: desktopStepTwoElements,
                mobileStepOneElements: mobileStepOneElements,
                mobileStepTwoElements: mobileStepTwoElements,
                step: step,
                view: view,
            };
            console.log("Serialized Popup State:", state);
            return state;
        },
        serializePopupSettings: function () {
            var state = {
                desktopStep1: desktopConfigStep1,
                desktopStep2: desktopConfigStep2,
                mobileStep1: mobileConfigStep1,
                mobileStep2: mobileConfigStep2,
            };
            console.log("Serialized Popup Settings:", state);
            return state;
        },
        deserializeRealPopUp: function (serializedState) {
            console.log("Deserializing Real Popup State:", serializedState);
            if (serializedState) {
                setDesktopStepOneElements(serializedState.desktopStepOneElements);
                setDesktopStepTwoElements(serializedState.desktopStepTwoElements);
                setMobileStepOneElements(serializedState.mobileStepOneElements);
                setMobileStepTwoElements(serializedState.mobileStepTwoElements);
                setStep(serializedState.step);
                setView(serializedState.view);
            }
        },
        deserializePopupSettings: function (settingsState) {
            console.log("Deserializing Popup Settings State:", settingsState);
            if (settingsState) {
                setDesktopConfigStep1(settingsState.desktopStep1 || initialDesktopConfigStep1);
                setDesktopConfigStep2(settingsState.desktopStep2 || initialDesktopConfigStep2);
                setMobileConfigStep1(settingsState.mobileStep1 || initialMobileConfigStep1);
                setMobileConfigStep2(settingsState.mobileStep2 || initialMobileConfigStep2);
            }
        },
    }); });
    return (<DndProvider backend={HTML5Backend}>
        <div className={"flex ".concat(className)}>
          <div className="w-1/4 p-4 border-r max-h-[750px] overflow-y-auto overflow-x-hidden">
            <ViewSelector view={view} setView={setView} previewStep={step} setDesktopConfigStep1={setDesktopConfigStep1} setDesktopConfigStep2={setDesktopConfigStep2} setMobileConfigStep1={setMobileConfigStep1} setMobileConfigStep2={setMobileConfigStep2}/>
            <SettingsPanel isOpen={isSettingsOpen} toggleSettings={toggleSettings} config={currentConfig} handleConfigChange={handleConfigChange} handleValueChange={handleValueChange}/>
            <DragAndDropSection />
            {view === "desktop" ? (<DesktopCustomizationPanel elements={step === 1 ? desktopStepOneElements : desktopStepTwoElements} onUpdate={handleElementUpdate} onRemove={handleRemoveElement} imageRecentlyAdded={imageRecentlyAdded} setImageRecentlyAdded={setImageRecentlyAdded}/>) : (<MobileCustomizationPanel elements={step === 1 ? mobileStepOneElements : mobileStepTwoElements} onUpdate={handleElementUpdate} onRemove={handleRemoveElement} imageRecentlyAdded={imageRecentlyAdded} setImageRecentlyAdded={setImageRecentlyAdded}/>)}
          </div>
          <div className="w-3/4 p-4">
            <StepSelector step={step} setStep={setStep}/>
            <div className="mt-4 flex justify-center items-center bg-gray-100 border-2 border-gray-200 relative h-[580px]">
              <PopupPreview stepOneElements={view === "desktop"
            ? desktopStepOneElements
            : mobileStepOneElements} setStepOneElements={view === "desktop"
            ? setDesktopStepOneElements
            : setMobileStepOneElements} stepTwoElements={view === "desktop"
            ? desktopStepTwoElements
            : mobileStepTwoElements} setStepTwoElements={view === "desktop"
            ? setDesktopStepTwoElements
            : setMobileStepTwoElements} view={view} config={currentConfig} step={step} onImageAdd={handleImageAdd} setStep={setStep} // Pass setStep to handle step changes
    />
            </div>
          </div>
        </div>
      </DndProvider>);
});
PopupBuilder.displayName = "PopupBuilder";
export default PopupBuilder;
