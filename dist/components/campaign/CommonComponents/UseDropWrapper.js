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
import { useDrop } from "react-dnd";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ItemTypes, } from "./Types";
import { defaultButtonProps } from "./ButtonElement";
import { defaultTextProps } from "./TextElement";
import { moveElement } from "./MoveElement";
export var useDropWrapper = function (step, stepOneElements, setStepOneElements, stepTwoElements, setStepTwoElements, setHoverIndex, hoverIndex) {
    var containerRef = useRef(null);
    var _a = useDrop({
        accept: [ItemTypes.TEXT_ELEMENT, ItemTypes.BUTTON_ELEMENT],
        hover: function (item, monitor) {
            if (!containerRef.current)
                return;
            var hoverBoundingRect = containerRef.current.getBoundingClientRect();
            var clientOffset = monitor.getClientOffset();
            var hoverClientX = clientOffset
                ? clientOffset.x - hoverBoundingRect.left
                : 0;
            var newHoverIndex = Math.floor((hoverClientX / hoverBoundingRect.width) *
                (step === 1 ? stepOneElements.length : stepTwoElements.length));
            newHoverIndex = Math.max(0, Math.min(step === 1 ? stepOneElements.length : stepTwoElements.length, newHoverIndex));
            setHoverIndex(newHoverIndex);
        },
        drop: function (item) {
            var elements = step === 1 ? __spreadArray([], stepOneElements, true) : __spreadArray([], stepTwoElements, true);
            var setElements = step === 1 ? setStepOneElements : setStepTwoElements;
            var newIndex = hoverIndex !== null ? hoverIndex : elements.length;
            var existingIndex = elements.findIndex(function (element) { return element && element.id === item.id; });
            if (existingIndex !== -1) {
                moveElement(elements, setElements, existingIndex, newIndex);
            }
            else {
                var newElement = void 0;
                if (item.type === ItemTypes.TEXT_ELEMENT) {
                    newElement = __assign({ id: uuidv4(), type: "text" }, defaultTextProps);
                }
                else if (item.type === ItemTypes.BUTTON_ELEMENT) {
                    newElement = __assign({ id: uuidv4(), type: "button" }, defaultButtonProps);
                }
                else {
                    newElement = __assign({ id: uuidv4(), type: "text" }, defaultTextProps);
                }
                elements.splice(newIndex, 0, newElement);
                setElements(elements);
            }
            setHoverIndex(null);
        },
        collect: function (monitor) { return ({
            isOver: monitor.isOver(),
        }); },
    }), isOver = _a[0].isOver, drop = _a[1];
    return { isOver: isOver, drop: drop, containerRef: containerRef };
};
