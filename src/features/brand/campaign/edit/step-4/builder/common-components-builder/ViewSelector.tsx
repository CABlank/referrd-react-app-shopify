// src/components/campaign/CommonComponents/ViewSelector.tsx
import React from "react";
import DesktopViewIcon from "../../../../../../../components/icons/icons-builder/DesktopViewIcon";
import MobileViewIcon from "../../../../../../../components/icons/icons-builder/MobileViewIcon";
import { PopupConfig } from "./Types";

interface ViewSelectorProps {
  view: "desktop" | "mobile";
  setView: (view: "desktop" | "mobile") => void;
  previewStep: number;
  setDesktopConfigStep1: React.Dispatch<React.SetStateAction<PopupConfig>>;
  setDesktopConfigStep2: React.Dispatch<React.SetStateAction<PopupConfig>>;
  setMobileConfigStep1: React.Dispatch<React.SetStateAction<PopupConfig>>;
  setMobileConfigStep2: React.Dispatch<React.SetStateAction<PopupConfig>>;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  view,
  setView,
  previewStep,
  setDesktopConfigStep1,
  setDesktopConfigStep2,
  setMobileConfigStep1,
  setMobileConfigStep2,
}) => {
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (view === "desktop") {
      if (previewStep === 1) {
        setDesktopConfigStep1((prevConfig) => ({
          ...prevConfig,
          [name]: value,
        }));
      } else {
        setDesktopConfigStep2((prevConfig) => ({
          ...prevConfig,
          [name]: value,
        }));
      }
    } else {
      if (previewStep === 1) {
        setMobileConfigStep1((prevConfig) => ({
          ...prevConfig,
          [name]: value,
        }));
      } else {
        setMobileConfigStep2((prevConfig) => ({
          ...prevConfig,
          [name]: value,
        }));
      }
    }
  };

  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4 p-4 border-b-2">
      <p className="self-stretch flex-grow-0 flex-shrink-0 font-medium text-left">Select a View</p>
      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <div
          onClick={() => setView("desktop")}
          className={`flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-8 w-[50px] relative overflow-hidden gap-2.5 px-0.5 py-[3px] rounded ${
            view === "desktop"
              ? "bg-[#10ad1b]/[0.15] border border-[#10ad1b]"
              : "border border-[#a8a8a8]"
          } cursor-pointer`}
        >
          <DesktopViewIcon selected={view === "desktop"} />
        </div>
        <div
          onClick={() => setView("mobile")}
          className={`flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-8 w-[50px] relative overflow-hidden gap-2.5 px-0.5 py-[3px] rounded ${
            view === "mobile"
              ? "bg-[#10ad1b]/[0.15] border border-[#10ad1b]"
              : "border border-[#a8a8a8]"
          } cursor-pointer`}
        >
          <MobileViewIcon selected={view === "mobile"} />
        </div>
      </div>
    </div>
  );
};

export default ViewSelector;
