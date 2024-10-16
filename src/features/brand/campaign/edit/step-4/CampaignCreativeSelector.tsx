import React, { useState, useRef, useEffect, useMemo } from "react";
import ArrowDropdownIcon from "../../../../../components/icons/ArrowDropdownIcon";

// Utility function to update the error message element
export const updateErrorMessage = (message: string) => {
  const errorMessageArea = document.getElementById("error-message-area");
  if (errorMessageArea) {
    errorMessageArea.innerHTML = message;
  }
};

// Utility function to clear the error message element
export const clearErrorMessage = () => {
  const errorMessageArea = document.getElementById("error-message-area");
  if (errorMessageArea) {
    errorMessageArea.innerHTML = "";
  }
};

const CampaignCreativeSelector: React.FC<{
  className?: string;
  selectedFormat: string;
  onSelect: (format: string) => void;
  selectedSubFormat: "Popup" | "Bar";
  onSubFormatSelect: (subFormat: "Popup" | "Bar") => void;
  children?: React.ReactNode;
}> = ({ className, selectedFormat, onSelect, selectedSubFormat, onSubFormatSelect, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const errorMessageArea = document.getElementById("error-message-area");
    if (errorMessageArea && errorMessageArea.innerHTML.trim() !== "") {
      return;
    }
    setIsOpen(!isOpen);
  };

  // Function to handle setting the format and updating the attribute
  const handleSelectFormat = (format: string) => {
    // Set a custom attribute on the body element
    if (format === "Both" || format === "Popup") {
      document.body.setAttribute("data-selected-format", format);
    } else {
      document.body.removeAttribute("data-selected-format");
    }

    // Call the onSelect callback
    onSelect(format);
  };
  // Use MutationObserver to monitor both "data-selected-format" and "data-current-substep"
  useEffect(() => {
    const format = document.body.getAttribute("data-selected-format");
    const subStep = document.body.getAttribute("data-current-substep");
    const subStepNumber = parseInt(subStep || "0", 10);

    // Automatically select subformat based on substep range
    const observer = new MutationObserver(() => {
      const updatedFormat = document.body.getAttribute("data-selected-format");
      const updatedSubStep = document.body.getAttribute("data-current-substep");
      const updatedSubStepNumber = parseInt(updatedSubStep || "0", 10);

      // If in substep 4.1 to 4.4, select "Popup"
      if (
        updatedFormat === "Both" &&
        updatedSubStepNumber >= 1 &&
        updatedSubStepNumber <= 4 &&
        selectedSubFormat !== "Popup"
      ) {
        onSubFormatSelect("Popup");
      }

      // If in substep 4.5 to 4.8, select "Bar"
      if (
        updatedFormat === "Both" &&
        updatedSubStepNumber >= 5 &&
        updatedSubStepNumber <= 8 &&
        selectedSubFormat !== "Bar"
      ) {
        onSubFormatSelect("Bar");
      }
    });

    // Observe both "data-selected-format" and "data-current-substep" on the body
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-selected-format", "data-current-substep"],
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [selectedSubFormat, onSubFormatSelect]);

  const memoizedChildren = useMemo(() => {
    return <div>{children}</div>;
  }, [children]);

  useEffect(() => {
    // Clear error messages when component unmounts
    return () => {
      clearErrorMessage();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`bg-white shadow rounded-lg border border-gray-200 ${className}`}
    >
      <div className="px-6 pt-6">
        <div
          className="flex justify-between items-center mb-6 cursor-pointer"
          onClick={handleToggle}
        >
          <h2 className="text-xl font-semibold text-green-500">4. Campaign Creative</h2>
          <button className="focus:outline-none">
            <ArrowDropdownIcon isOpen={isOpen} />
          </button>
        </div>
        <hr className="border-gray-200 mb-6" />

        {/* Error Message Area */}
        <div id="error-message-area" className="text-red-600 mb-4"></div>
      </div>

      {/* Always render children but control visibility */}
      <div className={isOpen ? "block" : "hidden"}>
        <div className="px-6 pb-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-medium text-black/80 self-center">Customize your campaign display</p>
            <div className="flex gap-8">
              {/* Popup Option */}
              <div
                className={`flex justify-center items-center flex-1 gap-8 p-8 rounded-lg border border-gray-300 cursor-pointer ${
                  selectedFormat === "Popup" ? "border-green-500" : ""
                }`}
                onClick={() => handleSelectFormat("Popup")}
              >
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[67.5px] w-[76.5px] relative gap-[2.5px] p-[5px] rounded bg-neutral-200">
                  <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-[2.5px]">
                    <div className="flex-grow-0 flex-shrink-0 w-[7px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
                    <div className="flex-grow-0 flex-shrink-0 w-[57px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
                  </div>
                  <div className="flex-grow-0 flex-shrink-0 w-[66.5px] h-[49px] rounded-[1px] bg-[#b7b6b6] flex justify-center items-center">
                    <div className="w-[56.5px] h-[28.5px] rounded-[1px] bg-[#5c5c5c]" />
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="font-medium text-black/80">Popup</p>
                  <p className="text-sm text-black/50">
                    A fixed popup that will grab your visitors’ attention.
                  </p>
                </div>
              </div>
              {/* Popup + Bar Option */}
              <div
                className={`flex justify-center items-center flex-1 gap-8 p-8 rounded-lg border border-gray-300 cursor-pointer ${
                  selectedFormat === "Both" ? "border-green-500" : ""
                }`}
                onClick={() => handleSelectFormat("Both")}
              >
                <div className="flex flex-col items-center justify-start h-[67.5px] w-[76.5px] bg-neutral-200 rounded p-[5px] gap-[2.5px]">
                  <div className="w-[66.5px] h-1.5 rounded-[1px] bg-[#5c5c5c] mb-[2.5px]" />
                  <div className="flex justify-start items-start gap-[2.5px]">
                    <div className="w-[7px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
                    <div className="w-[57px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
                  </div>
                  <div className="w-[66.5px] h-[40.5px] rounded-[1px] bg-[#b7b6b6] mt-[2.5px]" />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="font-medium text-black/80">Popup + Bar</p>
                  <p className="text-sm text-black/50">
                    Combine a popup with a top bar for extra visibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Mini-selection for "Popup + Bar" */}
            {selectedFormat === "Both" && (
              <div className="flex gap-4 mt-4">
                <button
                  className={`flex-1 p-4 rounded-lg border ${
                    selectedSubFormat === "Popup" ? "border-green-500" : "border-gray-300"
                  }`}
                  onClick={() => onSubFormatSelect("Popup")}
                >
                  Configure Popup
                </button>
                <button
                  className={`flex-1 p-4 rounded-lg border ${
                    selectedSubFormat === "Bar" ? "border-green-500" : "border-gray-300"
                  }`}
                  onClick={() => onSubFormatSelect("Bar")}
                >
                  Configure Bar
                </button>
              </div>
            )}
          </div>
        </div>
        {memoizedChildren}
      </div>

      {/* Show selected format when closed */}
      {!isOpen && (
        <div className="text-sm text-gray-500 px-6 pb-6">
          <p>
            <strong>Selected format:</strong> {selectedFormat === "Both" ? "Popup + Bar" : "Popup"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignCreativeSelector;
