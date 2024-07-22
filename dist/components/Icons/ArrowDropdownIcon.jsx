// src/components/Icons/ArrowDropdownIcon.tsx
import React from "react";
var ArrowDropdownIcon = function (_a) {
    var isOpen = _a.isOpen, _b = _a.width, width = _b === void 0 ? 24 : _b, _c = _a.height, height = _c === void 0 ? 24 : _c;
    return (<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={"transform ".concat(isOpen ? "rotate-180" : "")} preserveAspectRatio="none">
      <path d="M18.75 8.625L12 15.375L5.25 8.625" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
};
export default ArrowDropdownIcon;
