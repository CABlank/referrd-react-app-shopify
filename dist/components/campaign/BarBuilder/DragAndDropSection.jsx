import React from "react";
import { useDrag } from "react-dnd";
import TextIcon from "../../Icons/IconsBuilder/TextIcon";
import ButtonIcon from "../../Icons/IconsBuilder/ButtonIcon";
import { ItemTypes } from "../CommonComponents/Types";
var DragAndDropSection = function () {
    var createDragSpec = function (itemType) { return ({
        type: itemType,
        item: { type: itemType },
        collect: function (monitor) { return ({
            isDragging: monitor.isDragging(),
        }); },
    }); };
    var _a = useDrag(createDragSpec(ItemTypes.TEXT_ELEMENT)), isTextDragging = _a[0].isDragging, dragText = _a[1];
    var _b = useDrag(createDragSpec(ItemTypes.BUTTON_ELEMENT)), isButtonDragging = _b[0].isDragging, dragButton = _b[1];
    var renderDraggableElement = function (ref, isDragging, IconComponent, text) { return (<div ref={ref} className={"flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ".concat(isDragging ? "opacity-50" : "")}>
      <IconComponent />
      <p className="text-sm font-medium text-center text-[#851087] mt-2">
        {text}
      </p>
    </div>); };
    return (<div className="p-4 bg-white border-b-2">
      <p className="font-semibold text-left text-gray-800">
        Drag and Drop Elements
      </p>
      <div className="flex justify-center items-center w-full gap-4 py-4">
        {renderDraggableElement(dragText, isTextDragging, TextIcon, "Text")}
        {renderDraggableElement(dragButton, isButtonDragging, ButtonIcon, "Button")}
      </div>
    </div>);
};
export default DragAndDropSection;
