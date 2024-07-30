var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import React from "react";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import ReferAndEarn from "./ReferAndEarn";
var StepOne = function (_a) {
    var elements = _a.elements, setElements = _a.setElements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, imagePosition = _a.imagePosition, view = _a.view, setUrl = _a.setUrl, setStep = _a.setStep, allowStepChange = _a.allowStepChange;
    var imageElement = elements.find(function (element) { return element.type === "image"; });
    var handleSubmit = function (name, email, number) { return __awaiter(void 0, void 0, void 0, function () {
        var uniqueUrl, newElement_1;
        return __generator(this, function (_a) {
            uniqueUrl = "https://example.com/?name=".concat(name, "&email=").concat(email, "&number=").concat(number);
            setUrl(uniqueUrl);
            if (view === "mobile") {
                newElement_1 = {
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
            // Simulate an asynchronous operation and return true
            return [2 /*return*/, Promise.resolve(true)];
        });
    }); };
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
