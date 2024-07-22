import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  ButtonElementProps,
  ElementProps,
  TextElementProps,
  DividerElementProps,
} from "./Types";
import TextElement from "./TextElement";
import ButtonElement from "./ButtonElement";
import DividerElement from "./DividerElement";
import { ItemTypes, DragItem } from "./Types";

interface ElementWrapperProps {
  element: ElementProps;
  index: number;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  elementWidth: string;
  hoverIndex: number | null;
  onRemove?: (id: string) => void;
  showRemoveButton?: boolean;
  enableDragAndDrop?: boolean; // Add the enableDragAndDrop prop
}

const ElementWrapper: React.FC<ElementWrapperProps> = ({
  element,
  index,
  moveElement,
  elementWidth,
  hoverIndex,
  onRemove,
  showRemoveButton = true,
  enableDragAndDrop = false, // Default to false
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Unconditionally call useDrag
  const [{ isDragging }, drag] = useDrag({
    type:
      element.type === "text"
        ? ItemTypes.TEXT_ELEMENT
        : element.type === "button"
        ? ItemTypes.BUTTON_ELEMENT
        : ItemTypes.DIVIDER_ELEMENT,
    item: { type: element.type, id: element.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Unconditionally call useDrop
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [
      ItemTypes.TEXT_ELEMENT,
      ItemTypes.BUTTON_ELEMENT,
      ItemTypes.DIVIDER_ELEMENT,
    ],
    hover: (item: DragItem, monitor) => {
      if (!ref.current || item.index === index) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset
        ? clientOffset.x - hoverBoundingRect.left
        : 0;

      if (hoverClientX < hoverBoundingRect.width / 2) {
        moveElement(item.index, index);
        item.index = index;
      } else {
        moveElement(item.index, index + 1);
        item.index = index + 1;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Apply drag and drop refs unconditionally
  drag(ref);
  drop(ref);

  if (!element || !element.id) {
    console.error("Element or element.id is undefined:", element);
    return null;
  }

  return (
    <div
      ref={ref}
      className={`flex-shrink-0 flex items-center cursor-grab place-content-center text-center ${
        enableDragAndDrop && isDragging ? "opacity-50" : ""
      } ${
        enableDragAndDrop && isOver && canDrop
          ? "border-2 border-dashed border-blue-500"
          : ""
      }`}
      style={{
        marginTop: (element as any).marginTop || "0px",
        marginBottom: (element as any).marginBottom || "0px",
      }}
    >
      {element.type === "text" && (
        <TextElement {...(element as TextElementProps)} />
      )}
      {element.type === "button" && (
        <ButtonElement {...(element as ButtonElementProps)} />
      )}
      {element.type === "divider" && (
        <DividerElement {...(element as DividerElementProps)} />
      )}
      {showRemoveButton && onRemove && (
        <button onClick={() => onRemove(element.id)} className="remove-button">
          Remove
        </button>
      )}
    </div>
  );
};

export default ElementWrapper;
