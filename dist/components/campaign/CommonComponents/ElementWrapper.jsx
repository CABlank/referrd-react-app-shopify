import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import TextElement from "./TextElement";
import ButtonElement from "./ButtonElement";
import DividerElement from "./DividerElement";
import { ItemTypes } from "./Types";
var ElementWrapper = function (_a) {
    var element = _a.element, index = _a.index, moveElement = _a.moveElement, elementWidth = _a.elementWidth, hoverIndex = _a.hoverIndex, onRemove = _a.onRemove, _b = _a.showRemoveButton, showRemoveButton = _b === void 0 ? true : _b, _c = _a.enableDragAndDrop, enableDragAndDrop = _c === void 0 ? false : _c;
    var ref = useRef(null);
    // Unconditionally call useDrag
    var _d = useDrag({
        type: element.type === "text"
            ? ItemTypes.TEXT_ELEMENT
            : element.type === "button"
                ? ItemTypes.BUTTON_ELEMENT
                : ItemTypes.DIVIDER_ELEMENT,
        item: { type: element.type, id: element.id, index: index },
        collect: function (monitor) { return ({
            isDragging: monitor.isDragging(),
        }); },
    }), isDragging = _d[0].isDragging, drag = _d[1];
    // Unconditionally call useDrop
    var _e = useDrop({
        accept: [
            ItemTypes.TEXT_ELEMENT,
            ItemTypes.BUTTON_ELEMENT,
            ItemTypes.DIVIDER_ELEMENT,
        ],
        hover: function (item, monitor) {
            if (!ref.current || item.index === index)
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
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }); },
    }), _f = _e[0], isOver = _f.isOver, canDrop = _f.canDrop, drop = _e[1];
    // Apply drag and drop refs unconditionally
    drag(ref);
    drop(ref);
    if (!element || !element.id) {
        console.error("Element or element.id is undefined:", element);
        return null;
    }
    return (<div ref={ref} className={"flex-shrink-0 flex items-center cursor-grab place-content-center text-center ".concat(enableDragAndDrop && isDragging ? "opacity-50" : "", " ").concat(enableDragAndDrop && isOver && canDrop
            ? "border-2 border-dashed border-blue-500"
            : "")} style={{
            marginTop: element.marginTop || "0px",
            marginBottom: element.marginBottom || "0px",
        }}>
      {element.type === "text" && (<TextElement {...element}/>)}
      {element.type === "button" && (<ButtonElement {...element}/>)}
      {element.type === "divider" && (<DividerElement {...element}/>)}
      {showRemoveButton && onRemove && (<button onClick={function () { return onRemove(element.id); }} className="remove-button">
          Remove
        </button>)}
    </div>);
};
export default ElementWrapper;
