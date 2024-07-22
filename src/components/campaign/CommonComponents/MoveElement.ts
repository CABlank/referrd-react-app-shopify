import { ElementProps } from "./Types";

export const moveElement = (
  elements: ElementProps[],
  setElements: React.Dispatch<React.SetStateAction<ElementProps[]>>,
  dragIndex: number,
  hoverIndex: number
) => {
  const updatedElements = [...elements];
  const [removed] = updatedElements.splice(dragIndex, 1);
  updatedElements.splice(hoverIndex, 0, removed);
  setElements(updatedElements);
};
