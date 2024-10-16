import DOMPurify from "dompurify";
export var sanitizeInput = function (input) {
    return DOMPurify.sanitize(input);
};
export var validateInput = function (input, type) {
    switch (type) {
        case "text":
            return (input.length > 0 &&
                input.length <= 30 &&
                /^[a-zA-Z0-9\s,.!?'-]*$/.test(input));
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
