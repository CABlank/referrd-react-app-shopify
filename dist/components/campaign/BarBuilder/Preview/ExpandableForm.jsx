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
import React, { useState, useEffect, useRef, useCallback } from "react";
import ExpandableInput from "./ExpandableInput";
import NameIcon from "../../../Icons/IconsBuilder/NameIcon";
import EmailIcon from "../../../Icons/IconsBuilder/EmailIcon";
import MobileIcon from "../../../Icons/IconsBuilder/MobileIcon";
import { sanitizeInput, validateInput } from "../../../../utils/sanitizeInput";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
var ExpandableForm = function (_a) {
    var view = _a.view, onSubmit = _a.onSubmit, name = _a.name, setName = _a.setName, email = _a.email, setEmail = _a.setEmail, number = _a.number, setNumber = _a.setNumber, elements = _a.elements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove;
    var _b = useState(null), expandedInput = _b[0], setExpandedInput = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    var formRef = useRef(null);
    var handleFocus = useCallback(function (field) {
        setExpandedInput(field);
    }, []);
    var handleBlur = useCallback(function () {
        if (view === "mobile") {
            setExpandedInput(null);
        }
    }, [view]);
    var handleClickOutside = useCallback(function (event) {
        if (formRef.current && !formRef.current.contains(event.target)) {
            handleBlur();
        }
    }, [handleBlur]);
    useEffect(function () {
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);
    useEffect(function () {
        if (view === "desktop") {
            setExpandedInput(null);
        }
    }, [view]);
    var handleChange = useCallback(function (setter, type) {
        return function (e) {
            var value = sanitizeInput(e.target.value);
            setter(value);
            if (!validateInput(value, type)) {
                setErrors(function (prevErrors) {
                    var _a;
                    return (__assign(__assign({}, prevErrors), (_a = {}, _a[type] = "Invalid ".concat(type), _a)));
                });
            }
            else {
                setErrors(function (prevErrors) {
                    var _a = prevErrors, _b = type, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    return rest;
                });
            }
        };
    }, []);
    var handleSubmit = useCallback(function () {
        var isNameValid = validateInput(name, "text");
        var isEmailValid = validateInput(email, "email");
        var isNumberValid = validateInput(number, "tel");
        if (isNameValid && isEmailValid && isNumberValid) {
            onSubmit();
            window.parent.postMessage("goToStep2", "*");
        }
        else {
            setErrors(__assign(__assign(__assign({}, (isNameValid ? {} : { name: "Invalid name" })), (isEmailValid ? {} : { email: "Invalid email" })), (isNumberValid ? {} : { number: "Invalid phone number" })));
        }
    }, [name, email, number, onSubmit]);
    var renderExpandableInput = function (type, value, placeholder, setter, icon) { return (<ExpandableInput type={type} value={value} placeholder={placeholder} onChange={handleChange(setter, type)} isExpanded={expandedInput === type} onFocus={function () { return handleFocus(type); }} onBlur={handleBlur} view={view} icon={icon} error={!!errors[type]}/>); };
    return (<div ref={formRef} className="flex flex-col md:flex-row justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
      {view === "desktop" ? (<>
          {renderExpandableInput("text", name, "Name", setName)}
          {renderExpandableInput("email", email, "Email", setEmail)}
          {renderExpandableInput("tel", number, "Phone", setNumber)}
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[97px] h-9 relative gap-2 px-6 py-2.5 rounded-lg bg-white">
            <button id="join-us-button" // Add ID to the button
         className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#0d0c16]" onClick={handleSubmit}>
              Join us
            </button>
          </div>
        </>) : (<div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0">
          <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-white">
            {elements.map(function (element, index) {
                if (!element || !element.id) {
                    console.error("Invalid element at index:", index, element);
                    return null;
                }
                return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false}/>);
            })}
          </p>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-full gap-2">
            {renderExpandableInput("text", name, "Name", setName, <NameIcon />)}
            {renderExpandableInput("email", email, "Email", setEmail, <EmailIcon />)}
            {renderExpandableInput("tel", number, "Phone", setNumber, <MobileIcon />)}
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-4 py-2.5 rounded-lg bg-white h-8">
              <button id="join-us-button" // Add ID to the button
         className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-black" onClick={handleSubmit}>
                Join us
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
export default ExpandableForm;
