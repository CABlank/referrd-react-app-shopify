var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from "react";
import ExpandableForm from "./ExpandableForm";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
var StepOne = function (_a) {
    var elements = _a.elements, setElements = _a.setElements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, view = _a.view, setUrl = _a.setUrl, setStep = _a.setStep, allowStepChange = _a.allowStepChange;
    var _b = useState(""), name = _b[0], setName = _b[1];
    var _c = useState(""), email = _c[0], setEmail = _c[1];
    var _d = useState(""), number = _d[0], setNumber = _d[1];
    var handleSubmit = function () {
        var uniqueUrl = "https://example.com/?name=".concat(name, "&email=").concat(email, "&number=").concat(number);
        setUrl(uniqueUrl);
        if (view === "mobile") {
            var newElement_1 = {
                id: "".concat(Date.now()), // Generate a unique ID for the new element
                type: "text",
                props: {
                    name: name,
                    email: email,
                    number: number,
                },
            };
            setElements(function (prevElements) { return __spreadArray(__spreadArray([], prevElements, true), [newElement_1], false); });
        }
        if (allowStepChange) {
            setStep(2);
        }
    };
    return (<>
      {view === "desktop" && (<div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-0">
          {elements.map(function (element, index) {
                if (!element || !element.id) {
                    console.error("Invalid element at index:", index, element);
                    return null;
                }
                return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} enableDragAndDrop={true} // Ensure this is set to true
                />);
            })}
          {hoverIndex === elements.length && (<div className="flex-shrink-0" style={{ width: elementWidth, borderRight: "2px solid red" }}/>)}
        </div>)}
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-4">
        <ExpandableForm view={view} name={name} setName={setName} email={email} setEmail={setEmail} number={number} setNumber={setNumber} onSubmit={handleSubmit} elements={elements} moveElement={moveElement} hoverIndex={hoverIndex} elementWidth={elementWidth} onRemove={onRemove}/>
      </div>
    </>);
};
export default StepOne;
