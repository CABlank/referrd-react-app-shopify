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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes, } from "../../CommonComponents/Types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { v4 as uuidv4 } from "uuid";
import { defaultTextProps } from "../../CommonComponents/TextElement";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import { defaultDividerProps } from "../../CommonComponents/DividerElement";
var defaultImageProps = {
    imageUrl: "",
    imageWidth: "100",
    imageHeight: "100",
    borderRadius: "0", // Changed to string
    objectFit: "cover", // Ensuring objectFit is one of the specific string literals
    centerImage: false,
};
var PopupPreview = function (_a) {
    var stepOneElements = _a.stepOneElements, setStepOneElements = _a.setStepOneElements, stepTwoElements = _a.stepTwoElements, setStepTwoElements = _a.setStepTwoElements, view = _a.view, config = _a.config, step = _a.step, onImageAdd = _a.onImageAdd, setStep = _a.setStep;
    var _b = useState(null), hoverIndex = _b[0], setHoverIndex = _b[1];
    var _c = useState(false), imageRecentlyAdded = _c[0], setImageRecentlyAdded = _c[1];
    var _d = useState(""), url = _d[0], setUrl = _d[1]; // Add url state
    var containerRef = useRef(null);
    var imageExists = function (elements) {
        return elements.some(function (element) { return element.type === "image"; });
    };
    var moveElement = function (elements, setElements, dragIndex, hoverIndex) {
        var updatedElements = __spreadArray([], elements, true);
        var removed = updatedElements.splice(dragIndex, 1)[0];
        updatedElements.splice(hoverIndex, 0, removed);
        setElements(updatedElements);
    };
    var _e = useDrop({
        accept: [
            ItemTypes.TEXT_ELEMENT,
            ItemTypes.BUTTON_ELEMENT,
            ItemTypes.IMAGE,
            ItemTypes.DIVIDER_ELEMENT,
        ],
        canDrop: function (item) {
            return (item.type !== ItemTypes.IMAGE ||
                !imageExists(step === 1 ? stepOneElements : stepTwoElements));
        },
        hover: function (item, monitor) {
            if (!containerRef.current)
                return;
            var hoverBoundingRect = containerRef.current.getBoundingClientRect();
            var clientOffset = monitor.getClientOffset();
            if (!clientOffset)
                return; // Check if clientOffset is defined
            var hoverClientX = clientOffset.x - hoverBoundingRect.left;
            var newHoverIndex = Math.floor((hoverClientX / hoverBoundingRect.width) *
                (step === 1 ? stepOneElements.length : stepTwoElements.length));
            newHoverIndex = Math.max(0, Math.min(step === 1 ? stepOneElements.length : stepTwoElements.length, newHoverIndex));
            setHoverIndex(newHoverIndex);
        },
        drop: function (item) {
            if (item.type === ItemTypes.IMAGE &&
                imageExists(step === 1 ? stepOneElements : stepTwoElements)) {
                return;
            }
            var newIndex = hoverIndex !== null
                ? hoverIndex
                : step === 1
                    ? stepOneElements.length
                    : stepTwoElements.length;
            var newElements = step === 1 ? __spreadArray([], stepOneElements, true) : __spreadArray([], stepTwoElements, true);
            var existingIndex = newElements.findIndex(function (element) { return element.id === item.id; });
            if (existingIndex !== -1) {
                var movedElement = newElements.splice(existingIndex, 1)[0];
                newElements.splice(newIndex, 0, movedElement);
            }
            else {
                var newElement = void 0;
                if (item.type === ItemTypes.TEXT_ELEMENT) {
                    newElement = __assign(__assign({ id: uuidv4(), type: "text" }, defaultTextProps), { text: "", fontFamily: "", fontSize: "", textColor: "", textTransform: "none", fontWeight: "normal", letterSpacing: "0", marginTop: "0", marginRight: "0", marginBottom: "0", marginLeft: "0" }); // Ensure all required properties are strings
                }
                else if (item.type === ItemTypes.BUTTON_ELEMENT) {
                    newElement = __assign(__assign({ id: uuidv4(), type: "button" }, defaultButtonProps), { buttonText: "", buttonLink: "", buttonBackgroundColor: "", buttonTextColor: "", buttonBorderColor: "", buttonBorderWidth: 0, buttonBorderRadius: 0, paddingTop: "0", paddingRight: "0", paddingBottom: "0", paddingLeft: "0", marginTop: "0", marginRight: "0", marginBottom: "0", marginLeft: "0", fontFamily: "", fontSize: "", textAlign: "left", textTransform: "none", fontWeight: "normal", letterSpacing: "0", lineHeight: "1", hoverBackgroundColor: "", hoverTextColor: "", hoverBorderColor: "", buttonAlign: "flex-start" }); // Ensure all required properties are strings
                }
                else if (item.type === ItemTypes.DIVIDER_ELEMENT) {
                    newElement = __assign({ id: uuidv4(), type: "divider" }, defaultDividerProps);
                }
                else {
                    newElement = __assign({ id: uuidv4(), type: "image" }, defaultImageProps);
                }
                newElements.splice(newIndex, 0, newElement);
                if (item.type === ItemTypes.IMAGE) {
                    setImageRecentlyAdded(true);
                    onImageAdd();
                }
            }
            if (step === 1) {
                setStepOneElements(newElements);
            }
            else {
                setStepTwoElements(newElements);
            }
            setHoverIndex(null);
        },
        collect: function (monitor) { return ({
            isOver: monitor.isOver(),
        }); },
    }), isOver = _e[0].isOver, drop = _e[1];
    var elementWidth = "".concat(100 /
        ((step === 1 ? stepOneElements.length : stepTwoElements.length) +
            (hoverIndex !== null ? 1 : 0)), "%");
    var handleRemoveElement = function (elementId) {
        if (step === 1) {
            setStepOneElements(function (prevElements) {
                return prevElements.filter(function (element) { return element.id !== elementId; });
            });
        }
        else {
            setStepTwoElements(function (prevElements) {
                return prevElements.filter(function (element) { return element.id !== elementId; });
            });
        }
    };
    var commonStyle = {
        height: "".concat(config.height),
        width: "".concat(config.width),
        borderRadius: "".concat(config.borderWidth),
        backgroundColor: config.backgroundColor,
    };
    var desktopStyle = __assign(__assign({}, commonStyle), { overflowX: "hidden", position: "relative", margin: "0 auto" });
    var mobileStyle = __assign(__assign({}, commonStyle), { maxWidth: "100%", width: "".concat(config.width), margin: "0 auto" });
    return (<div ref={drop} className={"popup-preview flex items-center justify-center relative ".concat(isOver ? "bg-gray-100" : "")} style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
      <div className={"flex h-full items-center justify-center ".concat(config.ImagePosition === "Left" ? "flex-row-reverse" : "")} ref={containerRef} style={{
            flexWrap: "nowrap",
            overflowX: view === "desktop" ? "hidden" : "hidden",
            overflowY: "hidden",
        }}>
        <div className="popup-content" style={view === "desktop" ? desktopStyle : mobileStyle}>
          {step === 1 && (<StepOne elements={stepOneElements} setElements={setStepOneElements} moveElement={function (dragIndex, hoverIndex) {
                return moveElement(stepOneElements, setStepOneElements, dragIndex, hoverIndex);
            }} hoverIndex={hoverIndex} elementWidth={elementWidth} onRemove={handleRemoveElement} imagePosition={config.ImagePosition} view={view} setUrl={setUrl} // Pass setUrl to StepOne
         setStep={setStep} // Properly pass setStep
         allowStepChange={true}/>)}
          {step === 2 && (<StepTwo elements={stepTwoElements} setElements={setStepTwoElements} moveElement={function (dragIndex, hoverIndex) {
                return moveElement(stepTwoElements, setStepTwoElements, dragIndex, hoverIndex);
            }} hoverIndex={hoverIndex} elementWidth={elementWidth} onRemove={handleRemoveElement} view={view} url={url} // Pass url to StepTwo
         onClose={function () { return setStep(1); }}/>)}
        </div>
      </div>
    </div>);
};
export default PopupPreview;
