import { useDrop, DropTargetMonitor } from "react-dnd";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ElementProps,
  ItemTypes,
  TextElementProps,
  ButtonElementProps,
  DragItem,
} from "./Types";
import { defaultButtonProps } from "./ButtonElement";
import { defaultTextProps } from "./TextElement";
import { moveElement } from "./MoveElement";

export const useDropWrapper = (
  enableDragAndDrop: boolean,
  step: number,
  currentElements: ElementProps[],
  setCurrentElements: React.Dispatch<React.SetStateAction<ElementProps[]>>,
  setHoverIndex: React.Dispatch<React.SetStateAction<number | null>>,
  hoverIndex: number | null
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, unknown, { isOver: boolean }>({
    accept: [ItemTypes.TEXT_ELEMENT, ItemTypes.BUTTON_ELEMENT],

    hover: (item: DragItem, monitor: DropTargetMonitor<DragItem, unknown>) => {
      if (!enableDragAndDrop || !containerRef.current || item.index === hoverIndex) return;

      // Get bounding rectangle of the container
      const hoverBoundingRect = containerRef.current.getBoundingClientRect();

      // Get current mouse offset
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Calculate the mouse position relative to the container
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Calculate the width of each element inside the container
      const elementWidth = hoverBoundingRect.width / currentElements.length;

      // Calculate the middle of the hovered element
      const hoverMiddleX = elementWidth / 2;

      // Find the index of the element being hovered over
      const hoverIndexLocal = Math.floor(hoverClientX / elementWidth);

      // Ensure the hoverIndexLocal is within bounds
      const newHoverIndex = Math.max(0, Math.min(currentElements.length - 1, hoverIndexLocal));

      // Get the mouse position relative to the hovered element's center
      const hoverElementClientX = hoverClientX - newHoverIndex * elementWidth;

      // Move the element only if the cursor crosses the middle of the hovered element
      if (hoverElementClientX > hoverMiddleX && hoverIndex !== newHoverIndex) {
        setHoverIndex(newHoverIndex);
      }
    },

    drop: (item: DragItem) => {
      if (!enableDragAndDrop) return;

      const elements = [...currentElements];
      const setElements = setCurrentElements;

      const newIndex = hoverIndex !== null ? hoverIndex : elements.length;

      // Find if the element already exists
      const existingIndex = elements.findIndex(
        (element) => element && element.id === item.id
      );

      if (existingIndex !== -1) {
        // Move the element if it already exists in the array
        moveElement(elements, setElements, existingIndex, newIndex);
      } else {
        // Create a new element if it doesn't exist
        let newElement: ElementProps;

        if (item.type === ItemTypes.TEXT_ELEMENT) {
          newElement = {
            id: uuidv4(),
            type: "text",
            ...defaultTextProps,
          } as TextElementProps;
        } else if (item.type === ItemTypes.BUTTON_ELEMENT) {
          newElement = {
            id: uuidv4(),
            type: "button",
            ...defaultButtonProps,
          } as ButtonElementProps;
        } else {
          newElement = {
            id: uuidv4(),
            type: "text",
            ...defaultTextProps,
          } as TextElementProps;
        }

        // Insert the new element at the calculated index
        elements.splice(newIndex, 0, newElement);
        setElements(elements);
      }

      // Reset hover index
      setHoverIndex(null);
    },

    collect: (monitor) => ({
      isOver: enableDragAndDrop && monitor.isOver(),
    }),
  });

  return { isOver, drop: enableDragAndDrop ? drop : null, containerRef };
};
