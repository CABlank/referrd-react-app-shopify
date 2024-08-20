import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef, } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { moveElement } from "../../CommonComponents/MoveElement";
import { useDropWrapper } from "../../CommonComponents/UseDropWrapper";
import { desktopStyle, mobileStyle } from "./Styles";
var TopBarPreview = forwardRef(function (_a, ref) {
    var desktopStepOneElements = _a.desktopStepOneElements, setDesktopStepOneElements = _a.setDesktopStepOneElements, mobileStepOneElements = _a.mobileStepOneElements, setMobileStepOneElements = _a.setMobileStepOneElements, desktopStepTwoElements = _a.desktopStepTwoElements, setDesktopStepTwoElements = _a.setDesktopStepTwoElements, mobileStepTwoElements = _a.mobileStepTwoElements, setMobileStepTwoElements = _a.setMobileStepTwoElements, initialView = _a.view, desktopConfigStepOne = _a.desktopConfigStepOne, desktopConfigStepTwo = _a.desktopConfigStepTwo, mobileConfigStepOne = _a.mobileConfigStepOne, mobileConfigStepTwo = _a.mobileConfigStepTwo, step = _a.step, setUrl = _a.setUrl, url = _a.url, setStep = _a.setStep, _b = _a.allowStepChange, allowStepChange = _b === void 0 ? false : _b, isStepTwoAvailable = _a.isStepTwoAvailable, enableDragAndDrop = _a.enableDragAndDrop, _c = _a.forceMobileView, forceMobileView = _c === void 0 ? false : _c;
    var _d = useState(null), hoverIndex = _d[0], setHoverIndex = _d[1];
    var _e = useState(forceMobileView ? "mobile" : initialView), view = _e[0], setView = _e[1];
    // Refs for each combination
    var containerRefDesktopStepOne = useRef(null);
    var containerRefMobileStepOne = useRef(null);
    var containerRefDesktopStepTwo = useRef(null);
    var containerRefMobileStepTwo = useRef(null);
    // Determine which configuration to use based on the view and step
    var configStepOne = view === "desktop" ? desktopConfigStepOne : mobileConfigStepOne;
    var configStepTwo = view === "desktop" ? desktopConfigStepTwo : mobileConfigStepTwo;
    // Compile HTML
    var compileHtml = useCallback(function (ref, config) {
        if (ref.current) {
            var html = ref.current.innerHTML;
            return "<div style=\"background:".concat(config.backgroundColor, ";  height:").concat(config.height, "; width:100%;  display:flex; justify-content:center; align-items:center;\">").concat(html, "</div>");
        }
        return "";
    }, []);
    var getCompiledHtml = useCallback(function () {
        var htmlDesktopStepOne = compileHtml(containerRefDesktopStepOne, desktopConfigStepOne);
        var htmlMobileStepOne = compileHtml(containerRefMobileStepOne, mobileConfigStepOne);
        var htmlDesktopStepTwo = compileHtml(containerRefDesktopStepTwo, desktopConfigStepTwo);
        var htmlMobileStepTwo = compileHtml(containerRefMobileStepTwo, mobileConfigStepTwo);
        return {
            desktopStepOne: htmlDesktopStepOne,
            mobileStepOne: htmlMobileStepOne,
            desktopStepTwo: htmlDesktopStepTwo,
            mobileStepTwo: htmlMobileStepTwo,
        };
    }, [
        compileHtml,
        desktopConfigStepOne,
        desktopConfigStepTwo,
        mobileConfigStepOne,
        mobileConfigStepTwo,
    ]);
    useImperativeHandle(ref, function () { return ({
        getCompiledHtml: getCompiledHtml,
    }); });
    // Use DropWrapper for drag and drop functionality
    var dropWrapperDesktopStepOne = useDropWrapper(enableDragAndDrop, 1, desktopStepOneElements, setDesktopStepOneElements, setHoverIndex, hoverIndex);
    var dropWrapperMobileStepOne = useDropWrapper(enableDragAndDrop, 1, mobileStepOneElements, setMobileStepOneElements, setHoverIndex, hoverIndex);
    var dropWrapperDesktopStepTwo = useDropWrapper(enableDragAndDrop, 2, desktopStepTwoElements, setDesktopStepTwoElements, setHoverIndex, hoverIndex);
    var dropWrapperMobileStepTwo = useDropWrapper(enableDragAndDrop, 2, mobileStepTwoElements, setMobileStepTwoElements, setHoverIndex, hoverIndex);
    // Conditional rendering logic based on `step`
    return (<div>
        {/* Always render Step One */}
        <div style={{ display: step === 1 ? "block" : "none" }}>
          {/* Desktop Step One */}
          <div ref={dropWrapperDesktopStepOne.drop} className={"top-bar-preview px-2 flex items-center relative ".concat(dropWrapperDesktopStepOne.isOver ? "bg-gray-100" : "")} style={view === "desktop"
            ? desktopStyle(desktopConfigStepOne)
            : { display: "none" }}>
            <div className="flex h-full items-center justify-center gap-4" ref={containerRefDesktopStepOne} style={{
            flexWrap: "nowrap",
            width: "100%",
            overflowX: view === "desktop" ? "auto" : "hidden",
            overflowY: "hidden",
        }}>
              <StepOne elements={desktopStepOneElements} setElements={setDesktopStepOneElements} moveElement={function (dragIndex, hoverIndex) {
            return moveElement(desktopStepOneElements, setDesktopStepOneElements, dragIndex, hoverIndex);
        }} hoverIndex={hoverIndex} elementWidth={100 /
            (desktopStepOneElements.length +
                (hoverIndex !== null ? 1 : 0)) +
            "%"} onRemove={function (id) {
            return setDesktopStepOneElements(function (prevElements) {
                return prevElements.filter(function (element) { return element.id !== id; });
            });
        }} view="desktop" setUrl={setUrl} setStep={setStep} allowStepChange={allowStepChange} enableDragAndDrop={enableDragAndDrop}/>
            </div>
          </div>

          {/* Mobile Step One */}
          <div ref={dropWrapperMobileStepOne.drop} className={"top-bar-preview px-2 flex  items-center relative ".concat(dropWrapperMobileStepOne.isOver ? "bg-gray-100" : "")} style={view === "mobile"
            ? mobileStyle(mobileConfigStepOne)
            : { display: "none" }}>
            <div className="flex h-full items-center justify-center gap-4 " ref={containerRefMobileStepOne} style={{
            flexWrap: "nowrap",
            width: "100%",
            overflowX: view === "desktop" ? "auto" : "hidden",
            overflowY: "hidden",
        }}>
              <StepOne elements={mobileStepOneElements} setElements={setMobileStepOneElements} moveElement={function (dragIndex, hoverIndex) {
            return moveElement(mobileStepOneElements, setMobileStepOneElements, dragIndex, hoverIndex);
        }} hoverIndex={hoverIndex} elementWidth={100 /
            (mobileStepOneElements.length +
                (hoverIndex !== null ? 1 : 0)) +
            "%"} onRemove={function (id) {
            return setMobileStepOneElements(function (prevElements) {
                return prevElements.filter(function (element) { return element.id !== id; });
            });
        }} view="mobile" setUrl={setUrl} setStep={setStep} allowStepChange={allowStepChange} enableDragAndDrop={enableDragAndDrop}/>
            </div>
          </div>
        </div>

        {/* Always render Step Two */}
        <div id="parent-div" // This is the parent div where you want the scroll
     style={{
            display: step === 2 ? "block" : "none", // Conditionally rendered based on step
            overflowX: "auto", // Enable horizontal scrolling here
            width: "100%", // Full width to allow scrolling
            height: "100%", // Full height (adjust as necessary)
        }} onScroll={function (e) {
            // Check if the parent div is scrolled horizontally
            if (e.currentTarget.scrollLeft > 0) {
                console.log("Scrolled Parent Div ID:", e.currentTarget.id);
            }
        }}>
          {/* Desktop Step Two */}
          <div ref={dropWrapperDesktopStepTwo.drop} className={"top-bar-preview px-2 flex items-center relative ".concat(dropWrapperDesktopStepTwo.isOver ? "bg-gray-100" : "")} style={view === "desktop"
            ? desktopStyle(desktopConfigStepTwo)
            : { display: "none" }}>
            <div className="overflow-x-auto h-full w-full" style={{
            overflowX: "hidden", // Hide horizontal scrolling
            overflowY: "hidden", // Allow vertical scrolling
        }} // Allow horizontal scrolling
     onScroll={function (e) {
            var _a;
            if (e.currentTarget.scrollLeft > 0) {
                console.log("Parent Div ID:", (_a = document.getElementById("parent-div")) === null || _a === void 0 ? void 0 : _a.id);
            }
        }}>
              <div className="flex h-full items-center justify-center gap-4" ref={containerRefDesktopStepTwo} style={{
            flexWrap: "nowrap",
            width: "max-content",
        }}>
                <StepTwo elements={desktopStepTwoElements} setElements={setDesktopStepTwoElements} moveElement={function (dragIndex, hoverIndex) {
            return moveElement(desktopStepTwoElements, setDesktopStepTwoElements, dragIndex, hoverIndex);
        }} hoverIndex={hoverIndex} elementWidth={100 /
            (desktopStepTwoElements.length +
                (hoverIndex !== null ? 1 : 0)) +
            "%"} onRemove={function (id) {
            return setDesktopStepTwoElements(function (prevElements) {
                return prevElements.filter(function (element) { return element.id !== id; });
            });
        }} view="desktop"/>
              </div>
            </div>
          </div>

          {/* Mobile Step Two */}
          <div ref={dropWrapperMobileStepTwo.drop} className={"top-bar-preview px-2 flex items-center relative ".concat(dropWrapperMobileStepTwo.isOver ? "bg-gray-100" : "")} style={view === "mobile"
            ? mobileStyle(mobileConfigStepTwo)
            : { display: "none" }}>
            <div className="flex h-full items-center justify-center gap-4" ref={containerRefMobileStepTwo} style={{
            flexWrap: "nowrap",
            width: "100%",
            overflowX: view === "desktop" ? "auto" : "hidden",
            overflowY: "hidden",
        }}>
              <StepTwo elements={mobileStepTwoElements} setElements={setMobileStepTwoElements} moveElement={function (dragIndex, hoverIndex) {
            return moveElement(mobileStepTwoElements, setMobileStepTwoElements, dragIndex, hoverIndex);
        }} hoverIndex={hoverIndex} elementWidth={100 /
            (mobileStepTwoElements.length +
                (hoverIndex !== null ? 1 : 0)) +
            "%"} onRemove={function (id) {
            return setMobileStepTwoElements(function (prevElements) {
                return prevElements.filter(function (element) { return element.id !== id; });
            });
        }} view="mobile"/>
            </div>
          </div>
        </div>
      </div>);
});
export default TopBarPreview;
TopBarPreview.displayName = "TopBarPreview";
