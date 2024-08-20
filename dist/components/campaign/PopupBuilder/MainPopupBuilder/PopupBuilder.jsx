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
import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef, } from "react";
import DragAndDropSection from "../DragAndDropSection";
import CustomizationPanel from "../CustomizationPanel/CustomizationPanel";
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
    var containerRefDesktopStepOne = useRef(null);
    var containerRefDesktopStepTwo = useRef(null);
    var containerRefMobileStepOne = useRef(null);
    var containerRefMobileStepTwo = useRef(null);
    var _p = useState(""), compiledHtmlDesktopStepOne = _p[0], setCompiledHtmlDesktopStepOne = _p[1];
    var _q = useState(""), compiledHtmlDesktopStepTwo = _q[0], setCompiledHtmlDesktopStepTwo = _q[1];
    var _r = useState(""), compiledHtmlMobileStepOne = _r[0], setCompiledHtmlMobileStepOne = _r[1];
    var _s = useState(""), compiledHtmlMobileStepTwo = _s[0], setCompiledHtmlMobileStepTwo = _s[1];
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
    var compileHtmlDesktopStepOne = function () {
        if (containerRefDesktopStepOne.current) {
            var html = containerRefDesktopStepOne.current.innerHTML;
            var wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            var popupContent = wrapper.querySelector(".popup-content");
            if (popupContent) {
                popupContent.style.flexDirection = "row"; // Ensure row direction for desktop
            }
            setCompiledHtmlDesktopStepOne(wrapper.innerHTML);
        }
    };
    var compileHtmlDesktopStepTwo = function () {
        if (containerRefDesktopStepTwo.current) {
            var html = containerRefDesktopStepTwo.current.innerHTML;
            setCompiledHtmlDesktopStepTwo(html);
        }
    };
    var compileHtmlMobileStepOne = function () {
        if (containerRefMobileStepOne.current) {
            var html = containerRefMobileStepOne.current.innerHTML;
            var wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            // Ensure column direction for mobile in popup content
            var popupContent = wrapper.querySelector(".popup-content");
            if (popupContent) {
                popupContent.style.flexDirection = "column";
            }
            // Add styles to elements with the class 'image-drop'
            var imageDropElements = wrapper.querySelectorAll(".image-drop");
            imageDropElements.forEach(function (element) {
                element.style.removeProperty("width"); // Remove existing width property
                element.style.width = "100%";
                element.style.height = "16rem";
            });
            setCompiledHtmlMobileStepOne(wrapper.innerHTML);
        }
    };
    var compileHtmlMobileStepTwo = function () {
        if (containerRefMobileStepTwo.current) {
            var html = containerRefMobileStepTwo.current.innerHTML;
            setCompiledHtmlMobileStepTwo(html);
        }
    };
    // Deserialization on mount
    useEffect(function () {
        if (campaign.serializedPopupState) {
            var serializedState = JSON.parse(campaign.serializedPopupState);
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
            var settingsState = JSON.parse(campaign.settingsPopupState);
            if (settingsState) {
                setDesktopConfigStep1(settingsState.desktopStep1 || initialDesktopConfigStep1);
                setDesktopConfigStep2(settingsState.desktopStep2 || initialDesktopConfigStep2);
                setMobileConfigStep1(settingsState.mobileStep1 || initialMobileConfigStep1);
                setMobileConfigStep2(settingsState.mobileStep2 || initialMobileConfigStep2);
            }
        }
        compileHtmlDesktopStepOne();
        compileHtmlDesktopStepTwo();
        compileHtmlMobileStepOne();
        compileHtmlMobileStepTwo();
    }, [campaign.serializedPopupState, campaign.settingsPopupState]);
    useEffect(function () {
        compileHtmlDesktopStepOne();
    }, [desktopStepOneElements, desktopConfigStep1]);
    useEffect(function () {
        compileHtmlDesktopStepTwo();
    }, [desktopStepTwoElements, desktopConfigStep2]);
    useEffect(function () {
        compileHtmlMobileStepOne();
    }, [mobileStepOneElements, mobileConfigStep1]);
    useEffect(function () {
        compileHtmlMobileStepTwo();
    }, [mobileStepTwoElements, mobileConfigStep2]);
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
            return state;
        },
        serializePopupSettings: function () {
            var state = {
                desktopStep1: desktopConfigStep1,
                desktopStep2: desktopConfigStep2,
                mobileStep1: mobileConfigStep1,
                mobileStep2: mobileConfigStep2,
            };
            return state;
        },
        getCompiledHtml: function () {
            return {
                desktopStepOne: compiledHtmlDesktopStepOne,
                desktopStepTwo: compiledHtmlDesktopStepTwo,
                mobileStepOne: compiledHtmlMobileStepOne,
                mobileStepTwo: compiledHtmlMobileStepTwo,
            };
        },
        deserializeRealPopUp: function (serializedState) {
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
          <div className="w-1/4 p-4  max-h-[750px] overflow-y-auto overflow-x-hidden">
            <ViewSelector view={view} setView={function (newView) {
            setView(newView);
            compileHtmlDesktopStepOne();
            compileHtmlDesktopStepTwo();
            compileHtmlMobileStepOne();
            compileHtmlMobileStepTwo();
        }} previewStep={step} setDesktopConfigStep1={setDesktopConfigStep1} setDesktopConfigStep2={setDesktopConfigStep2} setMobileConfigStep1={setMobileConfigStep1} setMobileConfigStep2={setMobileConfigStep2}/>
            <SettingsPanel isOpen={isSettingsOpen} toggleSettings={toggleSettings} config={view === "desktop"
            ? step === 1
                ? desktopConfigStep1
                : desktopConfigStep2
            : step === 1
                ? mobileConfigStep1
                : mobileConfigStep2} handleConfigChange={handleConfigChange} handleValueChange={handleValueChange}/>
            <DragAndDropSection />
            <CustomizationPanel view={view} elements={step === 1
            ? view === "desktop"
                ? desktopStepOneElements
                : mobileStepOneElements
            : view === "desktop"
                ? desktopStepTwoElements
                : mobileStepTwoElements} onUpdate={handleElementUpdate} onRemove={handleRemoveElement} imageRecentlyAdded={imageRecentlyAdded} setImageRecentlyAdded={setImageRecentlyAdded}/>
          </div>
          <div className="w-3/4 p-4">
            <StepSelector step={step} setStep={setStep}/>
            <div className="mt-4 flex justify-center items-center bg-gray-100 border-2 border-gray-200 relative h-[580px]">
              <div ref={containerRefDesktopStepOne} className="w-full h-full absolute content-center top-0 left-0" style={{
            display: view === "desktop" && step === 1 ? "block" : "none",
        }}>
                <PopupPreview stepOneElements={desktopStepOneElements} setStepOneElements={setDesktopStepOneElements} stepTwoElements={desktopStepTwoElements} setStepTwoElements={setDesktopStepTwoElements} view={view} config={desktopConfigStep1} step={1} onImageAdd={handleImageAdd} setStep={setStep} onElementsChange={compileHtmlDesktopStepOne}/>
              </div>
              <div ref={containerRefDesktopStepTwo} className="w-full h-full absolute top-0 left-0" style={{
            display: view === "desktop" && step === 2 ? "block" : "none",
        }}>
                <PopupPreview stepOneElements={desktopStepOneElements} setStepOneElements={setDesktopStepOneElements} stepTwoElements={desktopStepTwoElements} setStepTwoElements={setDesktopStepTwoElements} view={view} config={desktopConfigStep2} step={2} onImageAdd={handleImageAdd} setStep={setStep} onElementsChange={compileHtmlDesktopStepTwo}/>
              </div>
              <div ref={containerRefMobileStepOne} className="w-full h-full absolute top-0 left-0" style={{
            display: view === "mobile" && step === 1 ? "block" : "none",
        }}>
                <PopupPreview stepOneElements={mobileStepOneElements} setStepOneElements={setMobileStepOneElements} stepTwoElements={mobileStepTwoElements} setStepTwoElements={setMobileStepTwoElements} view={view} config={mobileConfigStep1} step={1} onImageAdd={handleImageAdd} setStep={setStep} onElementsChange={compileHtmlMobileStepOne}/>
              </div>
              <div ref={containerRefMobileStepTwo} className="w-full h-full absolute top-0 left-0" style={{
            display: view === "mobile" && step === 2 ? "block" : "none",
        }}>
                <PopupPreview stepOneElements={mobileStepOneElements} setStepOneElements={setMobileStepOneElements} stepTwoElements={mobileStepTwoElements} setStepTwoElements={setMobileStepTwoElements} view={view} config={mobileConfigStep2} step={2} onImageAdd={handleImageAdd} setStep={setStep} onElementsChange={compileHtmlMobileStepTwo}/>
              </div>
            </div>
            <div style={{ display: "none" }}>
              <div>
                <h2>Compiled HTML - Desktop Step One:</h2>
                <div dangerouslySetInnerHTML={{
            __html: compiledHtmlDesktopStepOne,
        }}/>
                <h2>Compiled HTML - Desktop Step Two:</h2>
                <div dangerouslySetInnerHTML={{
            __html: compiledHtmlDesktopStepTwo,
        }}/>
                <h2>Compiled HTML - Mobile Step One:</h2>
                <div dangerouslySetInnerHTML={{
            __html: compiledHtmlMobileStepOne,
        }}/>
                <h2>Compiled HTML - Mobile Step Two:</h2>
                <div dangerouslySetInnerHTML={{
            __html: compiledHtmlMobileStepTwo,
        }}/>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>);
});
PopupBuilder.displayName = "PopupBuilder";
export default PopupBuilder;
