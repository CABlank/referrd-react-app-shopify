import React, { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ScrollableContainer = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll the content by a relative amount
  const scroll = (direction: number) => {
    const element = scrollRef.current as unknown as HTMLElement; // Add type assertion
    if (element) {
      const newScrollPosition =
        element.scrollLeft + direction * element.offsetWidth * 0.7;
      element.scrollTo({ left: newScrollPosition, behavior: "smooth" });
    }
  };

  // Check the current scroll position and update state
  const checkForScrollPosition = () => {
    const element = scrollRef.current as unknown as HTMLElement; // Add type assertion
    if (element) {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(element.scrollLeft < maxScrollLeft);
    }
  };

  // Set up event listeners
  useEffect(() => {
    const element = scrollRef.current as unknown as HTMLElement; // Add type assertion
    if (element) {
      element.addEventListener("scroll", checkForScrollPosition);
      checkForScrollPosition(); // Initial check
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", checkForScrollPosition);
      }
    };
  }, []);

  return (
    <div className="relative w-full flex justify-center ">
      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow cursor-pointer"
          onClick={() => scroll(-1)}
        >
          <FaArrowLeft />
        </button>
      )}
      <div
        className="flex overflow-hidden scroll-smooth scrollbar-hide gap-4 pb-4"
        ref={scrollRef}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow cursor-pointer"
          onClick={() => scroll(1)}
        >
          <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default ScrollableContainer;
