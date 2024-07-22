var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React from "react";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import ReferAndEarn from "./ReferAndEarn";
var StepOne = function (_a) {
    var elements = _a.elements, setElements = _a.setElements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, imagePosition = _a.imagePosition, view = _a.view, setUrl = _a.setUrl, setStep = _a.setStep, allowStepChange = _a.allowStepChange;
    var imageElement = elements.find(function (element) { return element.type === "image"; });
    var handleSubmit = function (name, email, number) {
        var uniqueUrl = "https://example.com/?name=".concat(name, "&email=").concat(email, "&number=").concat(number);
        setUrl(uniqueUrl);
        if (view === "mobile") {
            var newElement_1 = {
                id: "".concat(Date.now()), // Generate a unique ID for the new element
                type: "text",
                text: "".concat(name, " ").concat(email, " ").concat(number),
                fontFamily: "",
                fontSize: "",
                textColor: "",
                textTransform: "none",
                fontWeight: "normal",
                letterSpacing: "",
                marginTop: "",
                marginRight: "",
                marginBottom: "",
                marginLeft: "",
            };
            setElements(function (prevElements) { return __spreadArray(__spreadArray([], prevElements, true), [newElement_1], false); });
        }
        if (allowStepChange) {
            setStep(2);
        }
    };
    return (<ReferAndEarn imagePosition={imagePosition} imageUrl={imageElement === null || imageElement === void 0 ? void 0 : imageElement.imageUrl} imageProps={imageElement} view={view} onSubmit={handleSubmit} onClose={function () { return setStep(0); }}>
      <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "8px",
            position: "relative",
        }}>
        {elements
            .filter(function (element) { return element.type !== "image"; })
            .map(function (element, index) { return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} enableDragAndDrop={true}/>); })}
        {hoverIndex === elements.length && (<div style={{
                width: elementWidth,
                borderRight: "0px solid red",
                flexShrink: 0,
            }}/>)}
      </div>
    </ReferAndEarn>);
};
export default StepOne;
