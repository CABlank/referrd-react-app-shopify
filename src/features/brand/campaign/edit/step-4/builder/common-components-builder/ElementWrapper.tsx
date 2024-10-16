import React, { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import {
  ButtonElementProps,
  ElementProps,
  TextElementProps,
  DividerElementProps,
  InputElementProps,
} from "./Types";
import TextElement from "./TextElement";
import ButtonElement from "./ButtonElement";
import DividerElement from "./DividerElement";
import InputElement from "./InputElement";
import { ItemTypes, DragItem } from "./Types";
import { throttle } from "lodash"; // Import lodash throttle for debouncing hover

interface ElementWrapperProps {
  element: ElementProps;
  index: number;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  elementWidth: string;
  hoverIndex: number | null;
  onRemove?: (id: string) => void;
  showRemoveButton?: boolean;
  enableDragAndDrop?: boolean;
  view: "desktop" | "mobile";
  expandedId: string | undefined;
  onExpand: (id: string) => void;
  handleChange: (
    setter: React.Dispatch<React.SetStateAction<string>>,
    type: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit?: () => void; // Add handleSubmit prop
}

const ElementWrapper: React.FC<ElementWrapperProps> = ({
  element,
  index,
  moveElement,
  elementWidth,
  hoverIndex,
  onRemove,
  showRemoveButton = true,
  enableDragAndDrop = false,
  view,
  expandedId,
  onExpand,
  handleChange,
  handleSubmit, // Add handleSubmit prop
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type:
      element.type === "text"
        ? ItemTypes.TEXT_ELEMENT
        : element.type === "button"
          ? ItemTypes.BUTTON_ELEMENT
          : element.type === "divider"
            ? ItemTypes.DIVIDER_ELEMENT
            : ItemTypes.INPUT_ELEMENT,
    item: { type: element.type, id: element.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: enableDragAndDrop,
  });

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    unknown,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: [
      ItemTypes.TEXT_ELEMENT,
      ItemTypes.BUTTON_ELEMENT,
      ItemTypes.DIVIDER_ELEMENT,
      ItemTypes.INPUT_ELEMENT,
    ],
    hover: throttle((item: DragItem, monitor: DropTargetMonitor<DragItem, unknown>) => {
      if (!enableDragAndDrop || !ref.current || item.index === index) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset ? clientOffset.x - hoverBoundingRect.left : 0;

      // Calculate the middle of the hovered element
      const hoverMiddleX = hoverBoundingRect.width / 2;

      // Determine if the mouse has crossed the middle of the hovered element
      if (hoverClientX < hoverMiddleX && item.index !== index) {
        moveElement(item.index, index);
        item.index = index;
      } else if (hoverClientX >= hoverMiddleX && item.index !== index + 1) {
        moveElement(item.index, index + 1);
        item.index = index + 1;
      }
    }, 150), // Throttle the hover event to prevent rapid updates
    collect: (monitor) => ({
      isOver: enableDragAndDrop && monitor.isOver(),
      canDrop: enableDragAndDrop && monitor.canDrop(),
    }),
    canDrop: () => enableDragAndDrop,
  });

  if (enableDragAndDrop) {
    drag(ref);
    drop(ref);
  }

  if (!element || !element.id) {
    console.error("Element or element.id is undefined:", element);
    return null;
  }

  // Determine the type of input and set the appropriate name attribute
  const inputType = element.id.includes("text")
    ? "name"
    : element.id.includes("email")
      ? "email"
      : "phone";

  return (
    <div
      ref={ref}
      className={`flex-shrink-0 flex items-center ${
        enableDragAndDrop ? "cursor-grab" : ""
      } place-content-center text-center ${enableDragAndDrop && isDragging ? "opacity-50" : ""} ${
        enableDragAndDrop && isOver && canDrop ? "border-2 border-dashed border-blue-500" : ""
      }`}
      style={{
        marginTop: (element as any).marginTop || "0px",
        marginBottom: (element as any).marginBottom || "0px",
      }}
    >
      {element.type === "text" && <TextElement {...(element as TextElementProps)} />}
      {element.type === "button" && (
        <ButtonElement
          {...(element as ButtonElementProps)}
          onClick={handleSubmit} // Pass handleSubmit to ButtonElement
        />
      )}
      {element.type === "divider" && <DividerElement {...(element as DividerElementProps)} />}
      {element.type === "input" && (
        <InputElement
          {...(element as InputElementProps)}
          name={inputType} // Ensure the correct name attribute is passed
          view={view}
          expandedId={expandedId}
          onExpand={onExpand}
          onChange={handleChange(
            inputType === "name"
              ? (value) => {
                  /* handle name change */
                }
              : inputType === "email"
                ? (value) => {
                    /* handle email change */
                  }
                : (value) => {
                    /* handle phone change */
                  },
            inputType
          )}
        />
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
