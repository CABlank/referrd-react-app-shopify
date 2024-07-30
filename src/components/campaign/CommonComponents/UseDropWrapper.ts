import { useDrop } from "react-dnd";
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
  stepOneElements: ElementProps[],
  setStepOneElements: React.Dispatch<React.SetStateAction<ElementProps[]>>,
  stepTwoElements: ElementProps[],
  setStepTwoElements: React.Dispatch<React.SetStateAction<ElementProps[]>>,
  setHoverIndex: React.Dispatch<React.SetStateAction<number | null>>,
  hoverIndex: number | null
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: [ItemTypes.TEXT_ELEMENT, ItemTypes.BUTTON_ELEMENT],
    hover: (item, monitor) => {
      if (!enableDragAndDrop || !containerRef.current) return;

      const hoverBoundingRect = containerRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset
        ? clientOffset.x - hoverBoundingRect.left
        : 0;

      let newHoverIndex = Math.floor(
        (hoverClientX / hoverBoundingRect.width) *
          (step === 1 ? stepOneElements.length : stepTwoElements.length)
      );

      newHoverIndex = Math.max(
        0,
        Math.min(
          step === 1 ? stepOneElements.length : stepTwoElements.length,
          newHoverIndex
        )
      );

      setHoverIndex(newHoverIndex);
    },
    drop: (item: DragItem) => {
      if (!enableDragAndDrop) return;

      const elements = step === 1 ? [...stepOneElements] : [...stepTwoElements];
      const setElements = step === 1 ? setStepOneElements : setStepTwoElements;

      const newIndex = hoverIndex !== null ? hoverIndex : elements.length;

      const existingIndex = elements.findIndex(
        (element) => element && element.id === item.id
      );

      if (existingIndex !== -1) {
        moveElement(elements, setElements, existingIndex, newIndex);
      } else {
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

        elements.splice(newIndex, 0, newElement);
        setElements(elements);
      }

      setHoverIndex(null);
    },
    collect: (monitor) => ({
      isOver: enableDragAndDrop && monitor.isOver(),
    }),
  });

  return { isOver, drop: enableDragAndDrop ? drop : null, containerRef };
};
