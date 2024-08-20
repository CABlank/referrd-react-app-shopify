import { useEffect } from "react";
var useBodyStyle = function (styles) {
    useEffect(function () {
        // Apply the styles on mount
        for (var _i = 0, _a = Object.entries(styles); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            document.body.style[key] = value;
        }
        // Revert the styles on unmount
        return function () {
            for (var _i = 0, _a = Object.keys(styles); _i < _a.length; _i++) {
                var key = _a[_i];
                document.body.style[key] = "";
            }
        };
    }, [styles]);
};
export default useBodyStyle;
