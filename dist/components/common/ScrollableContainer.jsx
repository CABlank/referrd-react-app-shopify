import React, { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
var ScrollableContainer = function (_a) {
    var children = _a.children;
    var scrollRef = useRef(null);
    var _b = useState(false), canScrollLeft = _b[0], setCanScrollLeft = _b[1];
    var _c = useState(false), canScrollRight = _c[0], setCanScrollRight = _c[1];
    // Scroll the content by a relative amount
    var scroll = function (direction) {
        var element = scrollRef.current; // Add type assertion
        if (element) {
            var newScrollPosition = element.scrollLeft + direction * element.offsetWidth * 0.7;
            element.scrollTo({ left: newScrollPosition, behavior: "smooth" });
        }
    };
    // Check the current scroll position and update state
    var checkForScrollPosition = function () {
        var element = scrollRef.current; // Add type assertion
        if (element) {
            var maxScrollLeft = element.scrollWidth - element.clientWidth;
            setCanScrollLeft(element.scrollLeft > 0);
            setCanScrollRight(element.scrollLeft < maxScrollLeft);
        }
    };
    // Set up event listeners
    useEffect(function () {
        var element = scrollRef.current; // Add type assertion
        if (element) {
            element.addEventListener("scroll", checkForScrollPosition);
            checkForScrollPosition(); // Initial check
        }
        return function () {
            if (element) {
                element.removeEventListener("scroll", checkForScrollPosition);
            }
        };
    }, []);
    return (<div className="relative w-full flex justify-center ">
      {canScrollLeft && (<button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow cursor-pointer" onClick={function () { return scroll(-1); }}>
          <FaArrowLeft />
        </button>)}
      <div className="flex overflow-hidden scroll-smooth scrollbar-hide gap-4 pb-4" ref={scrollRef}>
        {children}
      </div>
      {canScrollRight && (<button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow cursor-pointer" onClick={function () { return scroll(1); }}>
          <FaArrowRight />
        </button>)}
    </div>);
};
export default ScrollableContainer;
