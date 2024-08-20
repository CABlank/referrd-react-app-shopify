import { useState, useEffect } from "react";
var useIsMobile = function (breakpoint) {
    if (breakpoint === void 0) { breakpoint = 768; }
    var _a = useState(false), isMobile = _a[0], setIsMobile = _a[1];
    useEffect(function () {
        var updateIsMobile = function () {
            setIsMobile(window.innerWidth <= breakpoint);
        };
        updateIsMobile();
        window.addEventListener("resize", updateIsMobile);
        return function () {
            window.removeEventListener("resize", updateIsMobile);
        };
    }, [breakpoint]);
    return isMobile;
};
export default useIsMobile;
