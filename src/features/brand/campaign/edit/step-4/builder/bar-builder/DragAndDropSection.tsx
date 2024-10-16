import React from "react";
import { useDrag } from "react-dnd";
import TextIcon from "../../../../../../../components/icons/icons-builder/TextIcon";
import ButtonIcon from "../../../../../../../components/icons/icons-builder/ButtonIcon";
import { ItemTypes } from "../common-components-builder/Types";

interface DragAndDropSectionProps {}

const DragAndDropSection: React.FC<DragAndDropSectionProps> = () => {
  const createDragSpec = (itemType: string) => ({
    type: itemType,
    item: { type: itemType },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isDragging: isTextDragging }, dragText] = useDrag(
    createDragSpec(ItemTypes.TEXT_ELEMENT)
  );
  const [{ isDragging: isButtonDragging }, dragButton] = useDrag(
    createDragSpec(ItemTypes.BUTTON_ELEMENT)
  );

  const renderDraggableElement = (
    ref: any,
    isDragging: boolean,
    IconComponent: React.ElementType,
    text: string
  ) => (
    <div
      ref={ref}
      className={`flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <IconComponent />
      <p className="text-sm font-medium text-center text-[#851087] mt-2">{text}</p>
    </div>
  );

  return (
    <div className="p-4 bg-white border-b-2">
      <p className="font-semibold text-left text-gray-800">Drag and Drop Elements</p>
      <div className="flex justify-center items-center w-full gap-4 py-4">
        {renderDraggableElement(dragText, isTextDragging, TextIcon, "Text")}
        {renderDraggableElement(dragButton, isButtonDragging, ButtonIcon, "Button")}
      </div>
    </div>
  );
};

export default DragAndDropSection;
