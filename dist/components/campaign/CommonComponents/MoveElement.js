var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export var moveElement = function (elements, setElements, dragIndex, hoverIndex) {
    var updatedElements = __spreadArray([], elements, true);
    var removed = updatedElements.splice(dragIndex, 1)[0];
    updatedElements.splice(hoverIndex, 0, removed);
    setElements(updatedElements);
};
