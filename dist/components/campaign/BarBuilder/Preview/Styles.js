var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var commonStyle = function (config) { return ({
    height: "".concat(config.height),
    backgroundColor: config.backgroundColor,
    width: "100%",
}); };
export var desktopStyle = function (config) { return (__assign(__assign({}, commonStyle(config)), { maxWidth: "100%", margin: "0 auto", overflowX: "hidden", position: "relative" })); };
export var mobileStyle = function (config) { return (__assign(__assign({}, commonStyle(config)), { maxWidth: "100%", margin: "0 auto" })); };
