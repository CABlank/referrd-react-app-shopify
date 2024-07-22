import React, { useState, useEffect, useRef } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { moveElement } from "../../CommonComponents/MoveElement";
import { useDropWrapper } from "../../CommonComponents/UseDropWrapper";
import { desktopStyle, mobileStyle } from "./Styles";
var TopBarPreview = function (_a) {
    var desktopStepOneElements = _a.desktopStepOneElements, setDesktopStepOneElements = _a.setDesktopStepOneElements, mobileStepOneElements = _a.mobileStepOneElements, setMobileStepOneElements = _a.setMobileStepOneElements, desktopStepTwoElements = _a.desktopStepTwoElements, setDesktopStepTwoElements = _a.setDesktopStepTwoElements, mobileStepTwoElements = _a.mobileStepTwoElements, setMobileStepTwoElements = _a.setMobileStepTwoElements, initialView = _a.view, config = _a.config, step = _a.step, setUrl = _a.setUrl, url = _a.url, setStep = _a.setStep, _b = _a.allowStepChange, allowStepChange = _b === void 0 ? false : _b, isStepTwoAvailable = _a.isStepTwoAvailable, enableDragAndDrop = _a.enableDragAndDrop, _c = _a.forceMobileView, forceMobileView = _c === void 0 ? false : _c;
    var _d = useState(null), hoverIndex = _d[0], setHoverIndex = _d[1];
    var _e = useState(forceMobileView ? "mobile" : initialView), view = _e[0], setView = _e[1];
    var prevDesktopStepOneLength = useRef(desktopStepOneElements.length);
    var prevDesktopStepTwoLength = useRef(desktopStepTwoElements.length);
    var prevMobileStepOneLength = useRef(mobileStepOneElements.length);
    var prevMobileStepTwoLength = useRef(mobileStepTwoElements.length);
    useEffect(function () {
        if (desktopStepOneElements.length > prevDesktopStepOneLength.current) {
            prevDesktopStepOneLength.current = desktopStepOneElements.length;
        }
    }, [desktopStepOneElements]);
    useEffect(function () {
        if (desktopStepTwoElements.length > prevDesktopStepTwoLength.current) {
            prevDesktopStepTwoLength.current = desktopStepTwoElements.length;
        }
    }, [desktopStepTwoElements]);
    useEffect(function () {
        if (mobileStepOneElements.length > prevMobileStepOneLength.current) {
            prevMobileStepOneLength.current = mobileStepOneElements.length;
        }
    }, [mobileStepOneElements]);
    useEffect(function () {
        if (mobileStepTwoElements.length > prevMobileStepTwoLength.current) {
            prevMobileStepTwoLength.current = mobileStepTwoElements.length;
        }
    }, [mobileStepTwoElements]);
    useEffect(function () {
        if (forceMobileView) {
            setView("mobile");
        }
        else {
            setView(initialView);
        }
    }, [forceMobileView, initialView]);
    var dropWrapper = useDropWrapper(step, view === "desktop" ? desktopStepOneElements : mobileStepOneElements, view === "desktop" ? setDesktopStepOneElements : setMobileStepOneElements, view === "desktop" ? desktopStepTwoElements : mobileStepTwoElements, view === "desktop" ? setDesktopStepTwoElements : setMobileStepTwoElements, setHoverIndex, hoverIndex);
    var _f = enableDragAndDrop
        ? dropWrapper
        : { isOver: false, drop: null, containerRef: null }, isOver = _f.isOver, drop = _f.drop, containerRef = _f.containerRef;
    var currentElements = view === "desktop"
        ? step === 1
            ? desktopStepOneElements
            : desktopStepTwoElements
        : step === 1
            ? mobileStepOneElements
            : mobileStepTwoElements;
    var setCurrentElements = view === "desktop"
        ? step === 1
            ? setDesktopStepOneElements
            : setDesktopStepTwoElements
        : step === 1
            ? setMobileStepOneElements
            : setMobileStepTwoElements;
    var safeCurrentElements = currentElements || [];
    var elementWidth = "".concat(100 / (safeCurrentElements.length + (hoverIndex !== null ? 1 : 0)), "%");
    var handleRemoveElement = function (elementId) {
        setCurrentElements(function (prevElements) {
            return prevElements.filter(function (element) { return element.id !== elementId; });
        });
    };
    useEffect(function () { }, [url]);
    useEffect(function () {
        var handleResize = function () {
            if (!forceMobileView) {
                var currentWidth = window.innerWidth;
                if (currentWidth <= 767) {
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
    }, [view, forceMobileView]);
    useEffect(function () { }, [view]);
    useEffect(function () {
        if (forceMobileView) {
            setView("mobile");
        }
    }, [forceMobileView]);
    useEffect(function () { }, [view, config]);
    return (<div ref={drop} className={"top-bar-preview px-2 flex items-center relative ".concat(isOver ? "bg-gray-100" : "")} style={view === "desktop" ? desktopStyle(config) : mobileStyle(config)}>
      <div className="flex h-full items-center justify-center gap-4" ref={containerRef} style={{
            flexWrap: "nowrap",
            width: "100%",
            overflowX: view === "desktop" ? "auto" : "hidden",
            overflowY: "hidden",
        }}>
        {step === 1 && (<StepOne elements={safeCurrentElements} setElements={setCurrentElements} moveElement={function (dragIndex, hoverIndex) {
                return moveElement(safeCurrentElements, setCurrentElements, dragIndex, hoverIndex);
            }} hoverIndex={hoverIndex} elementWidth={elementWidth} onRemove={handleRemoveElement} view={view} setUrl={setUrl} setStep={setStep} allowStepChange={allowStepChange}/>)}
        {step === 2 && (isStepTwoAvailable || allowStepChange) && (<StepTwo elements={safeCurrentElements} setElements={setCurrentElements} moveElement={function (dragIndex, hoverIndex) {
                return moveElement(safeCurrentElements, setCurrentElements, dragIndex, hoverIndex);
            }} hoverIndex={hoverIndex} elementWidth={elementWidth} onRemove={handleRemoveElement} view={view} url={url} onClose={function () { return setStep(1); }}/>)}
      </div>
    </div>);
};
export default TopBarPreview;
