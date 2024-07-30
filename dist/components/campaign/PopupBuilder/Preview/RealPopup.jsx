import React, { useEffect, useImperativeHandle, useState, forwardRef, } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PopupPreview from "./PopupPreview";
import { compress, decompress } from "compress-json";
var RealPopup = forwardRef(function (_a, ref) {
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
            var compressedState = JSON.parse(newSerializedState);
            var deserializedState = JSON.parse(JSON.stringify(decompress(compressedState)));
            console.log("Deserializing state:", deserializedState); // Added logging here
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
            console.log("Settings state provided:", settingsState);
            try {
                var deserializedSettings = JSON.parse(settingsState);
                console.log("Deserialized settings:", deserializedSettings);
                var currentConfig = getConfig(deserializedSettings, initialView, initialStep);
                setConfig(currentConfig);
                console.log("Current config:", currentConfig);
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
                var deserializedSettings = JSON.parse(settingsState !== null && settingsState !== void 0 ? settingsState : "");
                var desktopStep1 = parseInt(deserializedSettings.desktopStep2.width.replace("px", ""), 10) - 1;
                console.log("Mobile width:", desktopStep1);
                var newView = window.innerWidth <= desktopStep1 ? "mobile" : "desktop";
                setView(newView);
                if (settingsState) {
                    var deserializedSettings_1 = JSON.parse(settingsState);
                    var newConfig = getConfig(deserializedSettings_1, newView, step);
                    setConfig(newConfig);
                    console.log("New config after resize:", newConfig);
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
            setConfig(newConfig);
            console.log("New config after settings state change:", newConfig);
        }
    }, [view, step, settingsState]);
    return (<DndProvider backend={HTML5Backend}>
        <div className="real-popup-container" style={{
            width: (config === null || config === void 0 ? void 0 : config.width) || "100%",
            height: (config === null || config === void 0 ? void 0 : config.height) || "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
          {config && (<PopupPreview stepOneElements={view === "desktop"
                ? desktopStepOneElements
                : mobileStepOneElements} setStepOneElements={view === "desktop"
                ? setDesktopStepOneElementsState
                : setMobileStepOneElementsState} stepTwoElements={view === "desktop"
                ? desktopStepTwoElements
                : mobileStepTwoElements} setStepTwoElements={view === "desktop"
                ? setDesktopStepTwoElementsState
                : setMobileStepTwoElementsState} view={view} config={config} step={step} onImageAdd={function () { }} // Define the function or remove it if not necessary
         setStep={setStepState}/>)}
        </div>
      </DndProvider>);
});
RealPopup.displayName = "RealPopup";
export default RealPopup;
