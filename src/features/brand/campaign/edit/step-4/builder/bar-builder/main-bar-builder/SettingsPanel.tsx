import React from "react";
import ColorField from "../../common-components-builder/ColorField";
import TextField from "../../common-components-builder/TextField";
import ArrowDropdownIcon from "../../../../../../../../components/icons/ArrowDropdownIcon";
import { TopBarConfig } from "../../common-components-builder/Types";

export const initialDesktopConfigStep1: TopBarConfig = {
  backgroundColor: "#464ADF",
  height: "50px",
  width: undefined,
};
export const initialDesktopConfigStep2: TopBarConfig = {
  backgroundColor: "#464ADF",
  height: "50px",
  width: undefined,
};
export const initialMobileConfigStep1: TopBarConfig = {
  backgroundColor: "#464ADF",
  height: "50px",
  width: undefined,
};
export const initialMobileConfigStep2: TopBarConfig = {
  backgroundColor: "#464ADF",
  height: "120px",
  width: undefined,
};

interface SettingsPanelProps {
  isOpen: boolean;
  toggleSettings: () => void;
  config: TopBarConfig;
  view: "desktop" | "mobile";
  previewStep: number;
  setDesktopConfigStep1: React.Dispatch<React.SetStateAction<TopBarConfig>>;
  setDesktopConfigStep2: React.Dispatch<React.SetStateAction<TopBarConfig>>;
  setMobileConfigStep1: React.Dispatch<React.SetStateAction<TopBarConfig>>;
  setMobileConfigStep2: React.Dispatch<React.SetStateAction<TopBarConfig>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  toggleSettings,
  config,
  view,
  previewStep,
  setDesktopConfigStep1,
  setDesktopConfigStep2,
  setMobileConfigStep1,
  setMobileConfigStep2,
}) => {
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    if (view === "desktop") {
      if (previewStep === 1) {
        setDesktopConfigStep1((prevConfig) => ({
          ...prevConfig,
          height: `${value}px`,
        }));
      } else {
        setDesktopConfigStep2((prevConfig) => ({
          ...prevConfig,
          height: `${value}px`,
        }));
      }
    } else {
      if (previewStep === 1) {
        setMobileConfigStep1((prevConfig) => ({
          ...prevConfig,
          height: `${value}px`,
        }));
      } else {
        setMobileConfigStep2((prevConfig) => ({
          ...prevConfig,
          height: `${value}px`,
        }));
      }
    }
  };

  function handleConfigChange(e: React.ChangeEvent<HTMLInputElement>): void {
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
  }

  return (
    <div className="p-4 bg-white border-b-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleSettings}>
        <h2 className="font-semibold">Customize Top Bar</h2>
        <ArrowDropdownIcon isOpen={isOpen} width={20} height={20} />
      </div>
      {isOpen && (
        <div className="mt-4 space-y-4">
          <TextField
            label="Height"
            name="height"
            type="text"
            value={config.height.replace("px", "")}
            onChange={handleHeightChange}
            isMeasurement={true}
            style={{}}
          />
          <ColorField
            label="Background Color"
            name="backgroundColor"
            value={config.backgroundColor}
            onChange={(e) => handleConfigChange(e)}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
