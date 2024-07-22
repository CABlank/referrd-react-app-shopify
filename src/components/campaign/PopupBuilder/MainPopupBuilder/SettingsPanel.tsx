import React, { ChangeEvent } from "react";
import ColorField from "../../CommonComponents/ColorField";
import TextField from "../../CommonComponents/TextField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import { PopupConfig } from "../../CommonComponents/Types";
import SelectField from "../../CommonComponents/SelectField";

export const initialDesktopConfigStep1: PopupConfig = {
  backgroundColor: "#af9292",
  height: "320px",
  width: "650px",
  borderWidth: "16px",
  ImagePosition: "Right",
};

export const initialDesktopConfigStep2: PopupConfig = {
  backgroundColor: "#ffffff",
  height: "500px",
  width: "600px",
  borderWidth: "16px",
  ImagePosition: "None",
};

export const initialMobileConfigStep1: PopupConfig = {
  backgroundColor: "#af9292",
  height: "480px",
  width: "280px",
  borderWidth: "16px",
  ImagePosition: "Left",
};

export const initialMobileConfigStep2: PopupConfig = {
  backgroundColor: "#ffffff",
  height: "500px",
  width: "280px",
  borderWidth: "16px",
  ImagePosition: "None",
};

interface SettingsPanelProps {
  isOpen: boolean;
  config: PopupConfig;
  toggleSettings: () => void;
  handleConfigChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleValueChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "height" | "width" | "borderWidth"
  ) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  config,
  toggleSettings,
  handleConfigChange,
  handleValueChange,
}) => {
  return (
    <div className="p-4 bg-white border-b-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleSettings}
      >
        <h2 className="font-semibold">Customize PopUp</h2>
        <ArrowDropdownIcon isOpen={isOpen} width={20} height={20} />
      </div>
      {isOpen && (
        <div className="mt-4 space-y-4">
          <TextField
            label="Height"
            name="height"
            type="text"
            value={config.height.replace("px", "")}
            onChange={(e) =>
              handleValueChange(e as ChangeEvent<HTMLInputElement>, "height")
            }
            isMeasurement={true}
          />
          <TextField
            label="Width"
            name="width"
            type="text"
            value={config.width.replace("px", "")}
            onChange={(e) =>
              handleValueChange(e as ChangeEvent<HTMLInputElement>, "width")
            }
            isMeasurement={true}
          />
          <TextField
            label="Border Width"
            name="borderWidth"
            type="text"
            value={config.borderWidth.replace("px", "")}
            onChange={(e) =>
              handleValueChange(
                e as ChangeEvent<HTMLInputElement>,
                "borderWidth"
              )
            }
            isMeasurement={true}
          />
          <ColorField
            label="Background Color"
            name="backgroundColor"
            value={config.backgroundColor}
            onChange={handleConfigChange}
          />
          <SelectField
            label="Image Position"
            name="ImagePosition"
            value={config.ImagePosition}
            options={["None", "Left", "Right"]}
            onChange={handleConfigChange}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
