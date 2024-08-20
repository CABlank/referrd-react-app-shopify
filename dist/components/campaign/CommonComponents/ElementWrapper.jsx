import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import TextElement from "./TextElement";
import ButtonElement from "./ButtonElement";
import DividerElement from "./DividerElement";
import InputElement from "./InputElement";
import { ItemTypes } from "./Types";
var ElementWrapper = function (_a) {
    var element = _a.element, index = _a.index, moveElement = _a.moveElement, elementWidth = _a.elementWidth, hoverIndex = _a.hoverIndex, onRemove = _a.onRemove, _b = _a.showRemoveButton, showRemoveButton = _b === void 0 ? true : _b, _c = _a.enableDragAndDrop, enableDragAndDrop = _c === void 0 ? false : _c, view = _a.view, expandedId = _a.expandedId, onExpand = _a.onExpand, handleChange = _a.handleChange, handleSubmit = _a.handleSubmit;
    var ref = useRef(null);
    var _d = useDrag({
        type: element.type === "text"
            ? ItemTypes.TEXT_ELEMENT
            : element.type === "button"
                ? ItemTypes.BUTTON_ELEMENT
                : element.type === "divider"
                    ? ItemTypes.DIVIDER_ELEMENT
                    : ItemTypes.INPUT_ELEMENT,
        item: { type: element.type, id: element.id, index: index },
        collect: function (monitor) { return ({
            isDragging: monitor.isDragging(),
        }); },
        canDrag: enableDragAndDrop,
    }), isDragging = _d[0].isDragging, drag = _d[1];
    var _e = useDrop({
        accept: [
            ItemTypes.TEXT_ELEMENT,
            ItemTypes.BUTTON_ELEMENT,
            ItemTypes.DIVIDER_ELEMENT,
            ItemTypes.INPUT_ELEMENT,
        ],
        hover: function (item, monitor) {
            if (!enableDragAndDrop || !ref.current || item.index === index)
                return;
            var hoverBoundingRect = ref.current.getBoundingClientRect();
            var clientOffset = monitor.getClientOffset();
            var hoverClientX = clientOffset
                ? clientOffset.x - hoverBoundingRect.left
                : 0;
            if (hoverClientX < hoverBoundingRect.width / 2) {
                moveElement(item.index, index);
                item.index = index;
            }
            else {
                moveElement(item.index, index + 1);
                item.index = index + 1;
            }
        },
        collect: function (monitor) { return ({
            isOver: enableDragAndDrop && monitor.isOver(),
            canDrop: enableDragAndDrop && monitor.canDrop(),
        }); },
        canDrop: function () { return enableDragAndDrop; },
    }), _f = _e[0], isOver = _f.isOver, canDrop = _f.canDrop, drop = _e[1];
    if (enableDragAndDrop) {
        drag(ref);
        drop(ref);
    }
    if (!element || !element.id) {
        console.error("Element or element.id is undefined:", element);
        return null;
    }
    // Determine the type of input and set the appropriate name attribute
    var inputType = element.id.includes("text")
        ? "name"
        : element.id.includes("email")
            ? "email"
            : "phone";
    return (<div ref={ref} className={"flex-shrink-0 flex items-center ".concat(enableDragAndDrop ? "cursor-grab" : "", " place-content-center text-center ").concat(enableDragAndDrop && isDragging ? "opacity-50" : "", " ").concat(enableDragAndDrop && isOver && canDrop
            ? "border-2 border-dashed border-blue-500"
            : "")} style={{
            marginTop: element.marginTop || "0px",
            marginBottom: element.marginBottom || "0px",
        }}>
      {element.type === "text" && (<TextElement {...element}/>)}
      {element.type === "button" && (<ButtonElement {...element} onClick={handleSubmit} // Pass handleSubmit to ButtonElement
        />)}
      {element.type === "divider" && (<DividerElement {...element}/>)}
      {element.type === "input" && (<InputElement {...element} name={inputType} // Ensure the correct name attribute is passed
         view={view} expandedId={expandedId} onExpand={onExpand} onChange={handleChange(inputType === "name"
                ? function (value) {
                    /* handle name change */
                }
                : inputType === "email"
                    ? function (value) {
                        /* handle email change */
                    }
                    : function (value) {
                        /* handle phone change */
                    }, inputType)}/>)}
      {showRemoveButton && onRemove && (<button onClick={function () { return onRemove(element.id); }} className="remove-button">
          Remove
        </button>)}
    </div>);
};
export default ElementWrapper;
