import DOMPurify from "dompurify";

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

export const validateInput = (input: string, type: string): boolean => {
  switch (type) {
    case "text":
      return (
        input.length > 0 &&
        input.length <= 30 &&
        /^[a-zA-Z0-9\s,.!?'-]*$/.test(input)
      );
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case "tel":
      return /^\+?[1-9]\d{7,14}$/.test(input);
    case "url":
      return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(input);
    default:
      return false;
  }
};
