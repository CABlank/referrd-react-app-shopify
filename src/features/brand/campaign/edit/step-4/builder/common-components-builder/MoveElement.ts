import { ElementProps } from "./Types";

export const moveElement = (
  elements: ElementProps[],
  setElements: React.Dispatch<React.SetStateAction<ElementProps[]>>,
  dragIndex: number,
  hoverIndex: number
) => {
  // Only move if the dragIndex and hoverIndex are different
  if (dragIndex === hoverIndex) {
    return;  // No need to move, log, or update state if the indices are the same
  }

  // Clone the elements array to avoid mutating state directly
  const updatedElements = [...elements];

  // Ensure hoverIndex is within bounds
  if (hoverIndex < 0 || hoverIndex >= updatedElements.length) {
    console.warn('Hover index out of bounds:', hoverIndex);
    return;
  }

  // Remove the element from its original position
  const [removed] = updatedElements.splice(dragIndex, 1);

  // Insert the element at the new position
  updatedElements.splice(hoverIndex, 0, removed);

  // Update the elements state with the new order
  setElements(updatedElements);

  // Log a message indicating the element has been moved
};
