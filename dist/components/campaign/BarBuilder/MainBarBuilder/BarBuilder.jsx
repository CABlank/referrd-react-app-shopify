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
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, } from "react";
import DragAndDropSection from "../DragAndDropSection";
import DesktopCustomizationPanel from "../CustomizationPanel/DesktopCustomizationPanel";
import MobileCustomizationPanel from "../CustomizationPanel/MobileCustomizationPanel";
import TopBarPreview from "../Preview/TopBarPreview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ViewSelector from "../../CommonComponents/ViewSelector";
import StepSelector from "../../CommonComponents/StepSelector";
import SettingsPanel, { initialDesktopConfigStep1, initialDesktopConfigStep2, initialMobileConfigStep1, initialMobileConfigStep2, } from "./SettingsPanel";
// Utility functions to convert between TopBarConfig and PopupConfig
var convertToTopBarConfig = function (config) {
    var borderWidth = config.borderWidth, ImagePosition = config.ImagePosition, width = config.width, rest = __rest(config, ["borderWidth", "ImagePosition", "width"]);
    return rest;
};
var convertToPopupConfig = function (config) {
    return __assign(__assign({}, config), { borderWidth: "0px", ImagePosition: "center", width: "100%" });
};
var initialElements = [];
var BarBuilder = forwardRef(function (_a, ref) {
    var campaign = _a.campaign, className = _a.className;
    var realTopBarRef = useRef(null);
    // States for preview component
    var _b = useState(initialElements), desktopStepOneElements = _b[0], setDesktopStepOneElements = _b[1];
    var _c = useState(initialElements), desktopStepTwoElements = _c[0], setDesktopStepTwoElements = _c[1];
    var _d = useState(initialElements), mobileStepOneElements = _d[0], setMobileStepOneElements = _d[1];
    var _e = useState(initialElements), mobileStepTwoElements = _e[0], setMobileStepTwoElements = _e[1];
    var _f = useState(campaign.url), previewUrl = _f[0], setPreviewUrl = _f[1];
    var _g = useState(1), previewStep = _g[0], setPreviewStep = _g[1];
    var _h = useState(false), isStepTwoAvailable = _h[0], setIsStepTwoAvailable = _h[1];
    var _j = useState("desktop"), view = _j[0], setView = _j[1];
    var _k = useState(true), isSettingsOpen = _k[0], setIsSettingsOpen = _k[1];
    var _l = useState(initialDesktopConfigStep1), desktopConfigStep1 = _l[0], setDesktopConfigStep1 = _l[1];
    var _m = useState(initialDesktopConfigStep2), desktopConfigStep2 = _m[0], setDesktopConfigStep2 = _m[1];
    var _o = useState(initialMobileConfigStep1), mobileConfigStep1 = _o[0], setMobileConfigStep1 = _o[1];
    var _p = useState(initialMobileConfigStep2), mobileConfigStep2 = _p[0], setMobileConfigStep2 = _p[1];
    var overflowRef = useRef(null);
    var topBarPreviewRef = useRef(null);
    var _q = useState(false), manualViewChange = _q[0], setManualViewChange = _q[1];
    var _r = useState(0), key = _r[0], setKey = _r[1];
    useEffect(function () {
        if (overflowRef.current) {
            var scrollWidth = overflowRef.current.scrollWidth;
            var clientWidth = overflowRef.current.clientWidth;
            overflowRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
        }
    }, []);
    useEffect(function () {
        if (campaign.serializedTopbarState) {
            var serializedState = JSON.parse(campaign.serializedTopbarState);
            if (serializedState) {
                setDesktopStepOneElements(serializedState.desktopStepOneElements);
                setDesktopStepTwoElements(serializedState.desktopStepTwoElements);
                setMobileStepOneElements(serializedState.mobileStepOneElements);
                setMobileStepTwoElements(serializedState.mobileStepTwoElements);
                setPreviewUrl(serializedState.url);
                setPreviewStep(serializedState.step);
                setIsStepTwoAvailable(serializedState.isStepTwoAvailable);
                setView(serializedState.view);
            }
        }
        if (campaign.settingsTopbarState) {
            var settingsState = JSON.parse(campaign.settingsTopbarState);
            if (settingsState) {
                setDesktopConfigStep1(convertToTopBarConfig(settingsState.desktopStep1 || initialDesktopConfigStep1));
                setDesktopConfigStep2(convertToTopBarConfig(settingsState.desktopStep2 || initialDesktopConfigStep2));
                setMobileConfigStep1(convertToTopBarConfig(settingsState.mobileStep1 || initialMobileConfigStep1));
                setMobileConfigStep2(convertToTopBarConfig(settingsState.mobileStep2 || initialMobileConfigStep2));
            }
        }
    }, [campaign.serializedTopbarState, campaign.settingsTopbarState]);
    var handleElementUpdate = function (updatedElement) {
        var elements = previewStep === 1
            ? view === "desktop"
                ? desktopStepOneElements
                : mobileStepOneElements
            : view === "desktop"
                ? desktopStepTwoElements
                : mobileStepTwoElements;
        var setElements = previewStep === 1
            ? view === "desktop"
                ? setDesktopStepOneElements
                : setMobileStepOneElements
            : view === "desktop"
                ? setDesktopStepTwoElements
                : setMobileStepTwoElements;
        setElements(elements.map(function (element) {
            return element.id === updatedElement.id ? updatedElement : element;
        }));
    };
    var toggleSettings = function () {
        setIsSettingsOpen(!isSettingsOpen);
    };
    var handleRemoveElement = function (elementId) {
        var elements = previewStep === 1
            ? view === "desktop"
                ? desktopStepOneElements
                : mobileStepOneElements
            : view === "desktop"
                ? desktopStepTwoElements
                : mobileStepTwoElements;
        var setElements = previewStep === 1
            ? view === "desktop"
                ? setDesktopStepOneElements
                : setMobileStepOneElements
            : view === "desktop"
                ? setDesktopStepTwoElements
                : setMobileStepTwoElements;
        setElements(function (prevElements) {
            return prevElements.filter(function (element) { return element && element.id !== elementId; });
        });
    };
    var currentConfig = view === "desktop"
        ? previewStep === 1
            ? desktopConfigStep1
            : desktopConfigStep2
        : previewStep === 1
            ? mobileConfigStep1
            : mobileConfigStep2;
    useImperativeHandle(ref, function () { return ({
        serializeRealTopBar: function () {
            return {
                desktopStepOneElements: desktopStepOneElements,
                desktopStepTwoElements: desktopStepTwoElements,
                mobileStepOneElements: mobileStepOneElements,
                mobileStepTwoElements: mobileStepTwoElements,
                url: previewUrl,
                step: previewStep,
                isStepTwoAvailable: isStepTwoAvailable,
                view: view,
            };
        },
        serializeTopbarSettings: function () {
            return {
                desktopStep1: convertToPopupConfig(desktopConfigStep1),
                desktopStep2: convertToPopupConfig(desktopConfigStep2),
                mobileStep1: convertToPopupConfig(mobileConfigStep1),
                mobileStep2: convertToPopupConfig(mobileConfigStep2),
            };
        },
        deserializeRealTopBar: function (serializedState) {
            if (realTopBarRef.current) {
                setTimeout(function () {
                    realTopBarRef.current.deserializeState(JSON.stringify(serializedState));
                }, 0);
            }
        },
        deserializeTopbarSettings: function (settingsState) {
            if (settingsState) {
                setDesktopConfigStep1(convertToTopBarConfig(settingsState.desktopStep1 || initialDesktopConfigStep1));
                setDesktopConfigStep2(convertToTopBarConfig(settingsState.desktopStep2 || initialDesktopConfigStep2));
                setMobileConfigStep1(convertToTopBarConfig(settingsState.mobileStep1 || initialMobileConfigStep1));
                setMobileConfigStep2(convertToTopBarConfig(settingsState.mobileStep2 || initialMobileConfigStep2));
            }
        },
    }); });
    // Detect screen width and set view mode
    useEffect(function () {
        var handleResize = function () {
            if (!manualViewChange) {
                if (window.innerWidth <= 768) {
                    setView("mobile");
                }
                else {
                    setView("desktop");
                }
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return function () {
            window.removeEventListener("resize", handleResize);
        };
    }, [manualViewChange]);
    var handleViewChange = function (newView) {
        setView(newView);
        setManualViewChange(true);
        setKey(function (prevKey) { return prevKey + 1; });
    };
    useEffect(function () {
        if (topBarPreviewRef.current) {
            if (view === "mobile") {
                topBarPreviewRef.current.style.width = "375px";
                topBarPreviewRef.current.style.margin = "0 auto";
            }
            else {
                topBarPreviewRef.current.style.width = "100%";
                topBarPreviewRef.current.style.margin = "0";
            }
        }
    }, [view]);
    return (<DndProvider backend={HTML5Backend}>
        <div className={"flex ".concat(className)}>
          <div className="w-1/4 p-4 border-r max-h-[750px] overflow-y-auto overflow-x-hidden">
            <ViewSelector view={view} setView={handleViewChange} previewStep={previewStep} setDesktopConfigStep1={setDesktopConfigStep1} setDesktopConfigStep2={setDesktopConfigStep2} setMobileConfigStep1={setMobileConfigStep1} setMobileConfigStep2={setMobileConfigStep2}/>
            <SettingsPanel isOpen={isSettingsOpen} toggleSettings={toggleSettings} config={currentConfig} view={view} previewStep={previewStep} setDesktopConfigStep1={setDesktopConfigStep1} setDesktopConfigStep2={setDesktopConfigStep2} setMobileConfigStep1={setMobileConfigStep1} setMobileConfigStep2={setMobileConfigStep2}/>
            <DragAndDropSection />
            {view === "desktop" ? (<DesktopCustomizationPanel elements={previewStep === 1
                ? desktopStepOneElements
                : desktopStepTwoElements} onUpdate={handleElementUpdate} onRemove={handleRemoveElement}/>) : (<MobileCustomizationPanel elements={previewStep === 1
                ? mobileStepOneElements
                : mobileStepTwoElements} onUpdate={handleElementUpdate} onRemove={handleRemoveElement}/>)}
          </div>
          <div className="w-3/4 p-4">
            <StepSelector step={previewStep} setStep={setPreviewStep}/>
            <div ref={overflowRef} className="mt-4 custom-scrollbar overflow-x-auto overflow-y-hidden max-w-[980px] relative " style={{ height: "calc(".concat(currentConfig.height, " + 8px)") }}>
              <div ref={topBarPreviewRef}>
                <TopBarPreview key={key} // Force re-render on view change
     desktopStepOneElements={desktopStepOneElements} setDesktopStepOneElements={setDesktopStepOneElements} mobileStepOneElements={mobileStepOneElements} setMobileStepOneElements={setMobileStepOneElements} desktopStepTwoElements={desktopStepTwoElements} setDesktopStepTwoElements={setDesktopStepTwoElements} mobileStepTwoElements={mobileStepTwoElements} setMobileStepTwoElements={setMobileStepTwoElements} view={view} config={currentConfig} step={previewStep} setUrl={setPreviewUrl} url={previewUrl} setStep={setPreviewStep} allowStepChange={true} isStepTwoAvailable={isStepTwoAvailable} enableDragAndDrop={true} forceMobileView={view === "mobile"}/>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>);
});
BarBuilder.displayName = "BarBuilder";
export default BarBuilder;
