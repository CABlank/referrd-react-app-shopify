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
import React, { useState, useEffect, useCallback, useRef } from "react";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import { defaultButtonProps } from "../../CommonComponents/ButtonElement";
import { sanitizeInput } from "../../../../utils/sanitizeInput";
var createDefaultButtonElement = function (handleSubmit, isPreloaded) {
    if (isPreloaded === void 0) { isPreloaded = false; }
    return __assign(__assign({}, defaultButtonProps), { id: "submit-button", type: "button", buttonText: defaultButtonProps.buttonText || "Join Us", buttonLink: "#", buttonBackgroundColor: defaultButtonProps.buttonBackgroundColor || "#ffffff", buttonTextColor: defaultButtonProps.buttonTextColor || "#000000", buttonBorderColor: defaultButtonProps.buttonBorderColor || "#555555", buttonBorderWidth: defaultButtonProps.buttonBorderWidth || 1, buttonBorderRadius: defaultButtonProps.buttonBorderRadius || 8, paddingTop: defaultButtonProps.paddingTop || "4px", paddingRight: defaultButtonProps.paddingRight || "16px", paddingBottom: defaultButtonProps.paddingBottom || "4px", paddingLeft: defaultButtonProps.paddingLeft || "16px", marginTop: defaultButtonProps.marginTop || "0px", marginRight: defaultButtonProps.marginRight || "0px", marginBottom: defaultButtonProps.marginBottom || "0px", marginLeft: defaultButtonProps.marginLeft || "0px", fontFamily: defaultButtonProps.fontFamily || "Arial", fontSize: defaultButtonProps.fontSize || "14", textTransform: defaultButtonProps.textTransform || "none", fontWeight: defaultButtonProps.fontWeight || "normal", letterSpacing: defaultButtonProps.letterSpacing || "normal", lineHeight: defaultButtonProps.lineHeight || "normal", hoverBackgroundColor: defaultButtonProps.hoverBackgroundColor || "#ffffff", hoverTextColor: defaultButtonProps.hoverTextColor || "#000000", hoverBorderColor: defaultButtonProps.hoverBorderColor || "#555555", onClick: handleSubmit, isPreloaded: isPreloaded, textAlign: "center", buttonAlign: "center" });
};
var createDefaultInputElement = function (inputType, placeholder) {
    var name = inputType === "text" ? "name" : inputType === "email" ? "email" : "phone";
    return {
        id: "input-".concat(inputType, "-").concat(Date.now()),
        type: "input",
        value: "",
        placeholder: placeholder,
        bordercolor: "#FFFFFF",
        textcolor: "#FFFFFF",
        borderwidth: 1,
        borderradius: 8,
        name: name, // Assigning the name based on inputType
        onChange: function (e) { },
    };
};
var StepOne = function (_a) {
    var elements = _a.elements, setElements = _a.setElements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, view = _a.view, setUrl = _a.setUrl, setStep = _a.setStep, allowStepChange = _a.allowStepChange, enableDragAndDrop = _a.enableDragAndDrop;
    var _b = useState(""), name = _b[0], setName = _b[1];
    var _c = useState(""), email = _c[0], setEmail = _c[1];
    var _d = useState(""), number = _d[0], setNumber = _d[1];
    var _e = useState(undefined), expandedId = _e[0], setExpandedId = _e[1];
    var initialRender = useRef(true);
    var handleSubmit = useCallback(function () {
        var uniqueUrl = "https://example.com/?name=".concat(name, "&email=").concat(email, "&number=").concat(number);
        setUrl(uniqueUrl);
        window.parent.postMessage("goToStep2", "*");
        if (view === "mobile") {
            var newElement_1 = {
                id: "".concat(Date.now()),
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
    }, [
        name,
        email,
        number,
        setUrl,
        setStep,
        allowStepChange,
        setElements,
        view,
    ]);
    var handleChange = useCallback(function (setter, type) {
        return function (e) {
            var value = sanitizeInput(e.target.value);
            setter(value);
        };
    }, []);
    useEffect(function () {
        if (initialRender.current && elements.length === 0) {
            initialRender.current = false;
            var preloadedInputs = [
                createDefaultInputElement("text", "Name"),
                createDefaultInputElement("email", "Email"),
                createDefaultInputElement("tel", "Number"),
            ];
            var newButtonElement = createDefaultButtonElement(handleSubmit, true);
            setElements(__spreadArray(__spreadArray([], preloadedInputs, true), [newButtonElement], false));
        }
    }, [elements.length, handleSubmit, setElements]);
    return (<>
      <form method="post" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 0,
            flexShrink: 0,
            gap: "0px",
            outline: "none",
            boxShadow: "none",
        }}>
        {elements.map(function (element, index) {
            if (!element || !("id" in element)) {
                console.error("Invalid element at index:", index, element);
                return null;
            }
            return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={element.type === "button" &&
                    !element.isPreloaded
                    ? false
                    : false} enableDragAndDrop={enableDragAndDrop} view={view} expandedId={expandedId} onExpand={setExpandedId} handleChange={handleChange} handleSubmit={handleSubmit}/>);
        })}
        {hoverIndex === elements.length && (<div className="flex-shrink-0" style={{
                width: elementWidth,
                borderRight: "2px solid red",
                outline: "none",
                boxShadow: "none",
            }}/>)}
      </form>
    </>);
};
export default StepOne;
