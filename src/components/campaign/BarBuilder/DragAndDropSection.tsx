import React, { LegacyRef } from "react";
import { useDrag } from "react-dnd";
import TextIcon from "../../Icons/IconsBuilder/TextIcon";
import ButtonIcon from "../../Icons/IconsBuilder/ButtonIcon";
import { ItemTypes } from "../CommonComponents/Types";

interface DragAndDropSectionProps {}

const DragAndDropSection: React.FC<DragAndDropSectionProps> = () => {
  const [{ isDragging: isTextDragging }, dragText] = useDrag({
    type: ItemTypes.TEXT_ELEMENT,
    item: { type: ItemTypes.TEXT_ELEMENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isDragging: isButtonDragging }, dragButton] = useDrag({
    type: ItemTypes.BUTTON_ELEMENT,
    item: { type: ItemTypes.BUTTON_ELEMENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div className="p-4 bg-white border-b-2">
      <p className="font-semibold text-left text-gray-800">
        Drag and Drop Elements
      </p>
      <div className="flex justify-center items-center w-full gap-4 py-4">
        <div
          ref={dragText as unknown as LegacyRef<HTMLDivElement>}
          className={`flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
            isTextDragging ? "opacity-50" : ""
          }`}
        >
          <TextIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-0">
            Text
          </p>
        </div>
        <div
          ref={dragButton as unknown as LegacyRef<HTMLDivElement>}
          className={`flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
            isButtonDragging ? "opacity-50" : ""
          }`}
        >
          <ButtonIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-2">
            Button
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropSection;
