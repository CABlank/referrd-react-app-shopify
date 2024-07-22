import React from "react";
import { useDrag } from "react-dnd";
import TextIcon from "../../Icons/IconsBuilder/TextIcon";
import ButtonIcon from "../../Icons/IconsBuilder/ButtonIcon";
import { ItemTypes } from "../CommonComponents/Types";
var DragAndDropSection = function () {
    var _a = useDrag({
        type: ItemTypes.TEXT_ELEMENT,
        item: { type: ItemTypes.TEXT_ELEMENT },
        collect: function (monitor) { return ({
            isDragging: monitor.isDragging(),
        }); },
    }), isTextDragging = _a[0].isDragging, dragText = _a[1];
    var _b = useDrag({
        type: ItemTypes.BUTTON_ELEMENT,
        item: { type: ItemTypes.BUTTON_ELEMENT },
        collect: function (monitor) { return ({
            isDragging: monitor.isDragging(),
        }); },
    }), isButtonDragging = _b[0].isDragging, dragButton = _b[1];
    return (<div className="p-4 bg-white border-b-2">
      <p className="font-semibold text-left text-gray-800">
        Drag and Drop Elements
      </p>
      <div className="flex justify-center items-center w-full gap-4 py-4">
        <div ref={dragText} className={"flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ".concat(isTextDragging ? "opacity-50" : "")}>
          <TextIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-0">
            Text
          </p>
        </div>
        <div ref={dragButton} className={"flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ".concat(isButtonDragging ? "opacity-50" : "")}>
          <ButtonIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-2">
            Button
          </p>
        </div>
      </div>
    </div>);
};
export default DragAndDropSection;
