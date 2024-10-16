import React, { LegacyRef } from "react";
import { useDrag } from "react-dnd";
import TextIcon from "../../../../../../../components/icons/icons-builder/TextIcon";
import ButtonIcon from "../../../../../../../components/icons/icons-builder/ButtonIcon";
import ImageIcon from "../../../../../../../components/icons/icons-builder/ImageIcon";
import DividerIcon from "../../../../../../../components/icons/icons-builder/DividerIcon";
import { ItemTypes } from "../common-components-builder/Types";

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

  const [{ isDragging: isImageDragging }, dragImage] = useDrag({
    type: ItemTypes.IMAGE,
    item: { type: ItemTypes.IMAGE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isDragging: isDividerDragging }, dragDivider] = useDrag({
    type: ItemTypes.DIVIDER_ELEMENT,
    item: { type: ItemTypes.DIVIDER_ELEMENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div className="p-4 bg-white border-b-2">
      <p className="font-semibold text-left text-gray-800">Drag and Drop Elements</p>
      <div className="grid grid-cols-2 gap-4 py-4">
        <div
          ref={dragText as unknown as LegacyRef<HTMLDivElement>}
          className={`flex flex-col justify-center items-center h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
            isTextDragging ? "opacity-50" : ""
          }`}
        >
          <TextIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-0">Text</p>
        </div>
        <div
          ref={dragButton as unknown as LegacyRef<HTMLDivElement>}
          className={`flex flex-col justify-center items-center h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
            isButtonDragging ? "opacity-50" : ""
          }`}
        >
          <ButtonIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-2">Button</p>
        </div>
        <div
          ref={dragImage as unknown as LegacyRef<HTMLDivElement>}
          className={`flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
            isImageDragging ? "opacity-50" : ""
          }`}
        >
          <ImageIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-2">Image</p>
        </div>
        <div
          ref={dragDivider as unknown as LegacyRef<HTMLDivElement>}
          className={`flex flex-col justify-center items-center flex-grow h-[80px] relative px-2 py-4 rounded-lg bg-[#851087]/5 border-[0.5px] border-[#851087] shadow-sm transition-transform transform hover:scale-105 cursor-grab ${
            isDividerDragging ? "opacity-50" : ""
          }`}
        >
          <DividerIcon />
          <p className="text-sm font-medium text-center text-[#851087] mt-2">Divider</p>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropSection;
