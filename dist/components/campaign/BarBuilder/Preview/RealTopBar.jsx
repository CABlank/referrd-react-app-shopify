import React, { useEffect, useImperativeHandle, useState, forwardRef, } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TopBarPreview from "./TopBarPreview";
import { compress, decompress } from "compress-json";
var RealTopBar = forwardRef(function (_a, ref) {
    var serializedState = _a.serializedState, settingsState = _a.settingsState, _b = _a.stepOneElements, initialStepOneElements = _b === void 0 ? [] : _b, _c = _a.stepTwoElements, initialStepTwoElements = _c === void 0 ? [] : _c, setStepOneElements = _a.setStepOneElements, setStepTwoElements = _a.setStepTwoElements, _d = _a.view, initialView = _d === void 0 ? "desktop" : _d, _e = _a.step, initialStep = _e === void 0 ? 1 : _e, setStep = _a.setStep, _f = _a.url, initialUrl = _f === void 0 ? "" : _f, setUrl = _a.setUrl, setIsStepTwoAvailable = _a.setIsStepTwoAvailable, _g = _a.enableDragAndDrop, enableDragAndDrop = _g === void 0 ? false : _g, onLoad = _a.onLoad;
    var _h = useState(initialStepOneElements), desktopStepOneElements = _h[0], setDesktopStepOneElementsState = _h[1];
    var _j = useState(initialStepTwoElements), desktopStepTwoElements = _j[0], setDesktopStepTwoElementsState = _j[1];
    var _k = useState(initialStepOneElements), mobileStepOneElements = _k[0], setMobileStepOneElementsState = _k[1];
    var _l = useState(initialStepTwoElements), mobileStepTwoElements = _l[0], setMobileStepTwoElementsState = _l[1];
    var _m = useState(null), config = _m[0], setConfig = _m[1];
    var _o = useState(initialStep), step = _o[0], setStepState = _o[1];
    var _p = useState(initialUrl), url = _p[0], setUrlState = _p[1];
    var _q = useState(true), isStepTwoAvailable = _q[0], setIsStepTwoAvailableState = _q[1];
    var _r = useState(initialView), view = _r[0], setView = _r[1];
    var _s = useState(false), manualViewChange = _s[0], setManualViewChange = _s[1];
    var getConfig = function (settings, view, step) {
        return settings["".concat(view, "Step").concat(step)] || null;
    };
    // Function to deserialize state
    var deserializeState = function (newSerializedState) {
        if (!newSerializedState)
            return;
        try {
            console.log("Deserializing state:", newSerializedState);
            var compressedState = JSON.parse(newSerializedState);
            console.log("Compressed state:", compressedState);
            var deserializedState = JSON.parse(JSON.stringify(decompress(compressedState)));
            console.log("Decompressed state:", deserializedState);
            setDesktopStepOneElementsState(deserializedState.desktopStepOneElements || []);
            setDesktopStepTwoElementsState(deserializedState.desktopStepTwoElements || []);
            setMobileStepOneElementsState(deserializedState.mobileStepOneElements || []);
            setMobileStepTwoElementsState(deserializedState.mobileStepTwoElements || []);
            setStepState(deserializedState.step || 1);
            setUrlState(deserializedState.url || "");
            setIsStepTwoAvailableState(deserializedState.isStepTwoAvailable);
            setConfig(deserializedState.config || null);
            setView(deserializedState.view || "desktop");
            if (onLoad) {
                onLoad(); // Call onLoad after deserializing the state
            }
        }
        catch (error) {
            console.error("Failed to deserialize state:", error);
        }
    };
    useImperativeHandle(ref, function () { return ({
        serializeState: function () {
            if (!config)
                return null;
            var state = {
                desktopStepOneElements: desktopStepOneElements,
                desktopStepTwoElements: desktopStepTwoElements,
                mobileStepOneElements: mobileStepOneElements,
                mobileStepTwoElements: mobileStepTwoElements,
                view: view,
                config: config,
                step: step,
                url: url,
                isStepTwoAvailable: isStepTwoAvailable,
            };
            var serializedState = JSON.stringify(state);
            var compressedState = compress(JSON.parse(serializedState));
            return JSON.stringify(compressedState);
        },
        deserializeState: deserializeState,
    }); });
    useEffect(function () {
        if (serializedState) {
            console.log("Serialized state provided:", serializedState);
            var deserializedState = JSON.parse(serializedState);
            console.log("Parsed serialized state:", deserializedState);
            if (deserializedState) {
                setDesktopStepOneElementsState(deserializedState.desktopStepOneElements || []);
                setDesktopStepTwoElementsState(deserializedState.desktopStepTwoElements || []);
                setMobileStepOneElementsState(deserializedState.mobileStepOneElements || []);
                setMobileStepTwoElementsState(deserializedState.mobileStepTwoElements || []);
                setUrlState(deserializedState.url || "");
                setStepState(deserializedState.step || 1);
                setIsStepTwoAvailableState(deserializedState.isStepTwoAvailable || false);
                setView(deserializedState.view || "desktop");
                if (onLoad) {
                    onLoad(); // Call onLoad after setting the state
                }
            }
        }
        if (settingsState) {
            try {
                console.log("Settings state provided:", settingsState);
                var deserializedSettings = JSON.parse(settingsState);
                console.log("Deserialized settings:", deserializedSettings);
                var currentConfig = getConfig(deserializedSettings, initialView, initialStep);
                console.log("Current config:", currentConfig);
                setConfig(currentConfig);
                if (onLoad) {
                    onLoad(); // Call onLoad after deserializing the settings
                }
            }
            catch (error) {
                console.error("Failed to initialize with settings state:", error);
            }
        }
    }, [serializedState, settingsState, initialView, initialStep]);
    useEffect(function () {
        var handleResize = function () {
            if (!manualViewChange) {
                var newView = window.innerWidth <= 768 ? "mobile" : "desktop";
                console.log("Window resized, new view:", newView);
                setView(newView);
                if (settingsState) {
                    var deserializedSettings = JSON.parse(settingsState);
                    var newConfig = getConfig(deserializedSettings, newView, step);
                    console.log("New config after resize:", newConfig);
                    setConfig(newConfig);
                }
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return function () {
            window.removeEventListener("resize", handleResize);
        };
    }, [manualViewChange, step, settingsState]);
    useEffect(function () {
        if (setStepOneElements) {
            setStepOneElements(view === "desktop" ? desktopStepOneElements : mobileStepOneElements);
        }
    }, [
        desktopStepOneElements,
        mobileStepOneElements,
        setStepOneElements,
        view,
    ]);
    useEffect(function () {
        if (setStepTwoElements) {
            setStepTwoElements(view === "desktop" ? desktopStepTwoElements : mobileStepTwoElements);
        }
    }, [
        desktopStepTwoElements,
        mobileStepTwoElements,
        setStepTwoElements,
        view,
    ]);
    useEffect(function () {
        if (settingsState) {
            var deserializedSettings = JSON.parse(settingsState);
            var newConfig = getConfig(deserializedSettings, view, step);
            console.log("New config after settings state change:", newConfig);
            setConfig(newConfig);
        }
    }, [view, step, settingsState]);
    return (<DndProvider backend={HTML5Backend}>
        <div className="real-top-bar-container">
          <div className="frame-root">
            {config && (<TopBarPreview desktopStepOneElements={desktopStepOneElements} setDesktopStepOneElements={setDesktopStepOneElementsState} mobileStepOneElements={mobileStepOneElements} setMobileStepOneElements={setMobileStepOneElementsState} desktopStepTwoElements={desktopStepTwoElements} setDesktopStepTwoElements={setDesktopStepTwoElementsState} mobileStepTwoElements={mobileStepTwoElements} setMobileStepTwoElements={setMobileStepTwoElementsState} view={view} config={config} step={step} setUrl={setUrlState} url={url} setStep={setStepState} allowStepChange={true} isStepTwoAvailable={isStepTwoAvailable} enableDragAndDrop={enableDragAndDrop} forceMobileView={view === "mobile"}/>)}
          </div>
        </div>
      </DndProvider>);
});
RealTopBar.displayName = "RealTopBar";
export default RealTopBar;
