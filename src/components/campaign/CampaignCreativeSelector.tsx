import React, { useState } from "react";
import ArrowDropdownIcon from "../Icons/ArrowDropdownIcon";

const CampaignCreativeSelector: React.FC<{
  className?: string;
  selectedFormat: string;
  onSelect: (format: string) => void;
}> = ({ className, selectedFormat, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectFormat = (format: string) => {
    onSelect(format); // Call the onSelect callback with the selected format
  };

  return (
    <div
      className={`bg-white p-6 shadow rounded-lg border border-gray-200 ${className}`}
    >
      <div
        className="flex justify-between items-center mb-6 cursor-pointer"
        onClick={handleToggle}
      >
        <h2 className="text-xl font-semibold text-green-500">
          4. Campaign Creative
        </h2>
        <button className="focus:outline-none">
          <ArrowDropdownIcon isOpen={isOpen} />
        </button>
      </div>
      <hr className="border-gray-200 mb-6" />

      {isOpen ? (
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-medium text-black/80 self-center">
              Choose your preferred format
            </p>
            <div className="flex gap-8">
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
                    Grab your visitors’ attention with a striking popup.
                  </p>
                </div>
              </div>
              <div
                className={`flex justify-center items-center flex-1 gap-8 p-8 rounded-lg border border-gray-300 cursor-pointer ${
                  selectedFormat === "Topbar" ? "border-green-500" : ""
                }`}
                onClick={() => handleSelectFormat("Topbar")}
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
                  <p className="font-medium text-black/80">Bar</p>
                  <p className="text-sm text-black/50">
                    Display an unobtrusive message at the top or bottom of your
                    site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          <p>
            <strong>Selected format:</strong> {selectedFormat}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignCreativeSelector;
