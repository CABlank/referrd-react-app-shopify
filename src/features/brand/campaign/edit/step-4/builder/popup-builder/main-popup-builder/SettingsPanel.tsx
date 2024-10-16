import React, { ChangeEvent } from "react";
import ColorField from "../../common-components-builder/ColorField";
import TextField from "../../common-components-builder/TextField";
import ArrowDropdownIcon from "../../../../../../../../components/icons/ArrowDropdownIcon";
import SelectField from "../../common-components-builder/SelectField";
import { PopupConfig } from "../../common-components-builder/Types";

export const initialDesktopConfigStep1: PopupConfig = {
  backgroundColor: "#af9292",
  height: "320px",
  width: "650px",
  borderWidth: "16px",
  ImagePosition: "Right",
};

export const initialDesktopConfigStep2: PopupConfig = {
  backgroundColor: "#ffffff",
  height: "350px",
  width: "400px",
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
  height: "350px",
  width: "300px",
  borderWidth: "16px",
  ImagePosition: "None",
};

interface SettingsPanelProps {
  isOpen: boolean;
  config: PopupConfig;
  toggleSettings: () => void;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleValueChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "height" | "width" | "borderWidth" | "backgroundColor" | "ImagePosition"
  ) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  config,
  toggleSettings,
  handleConfigChange,
  handleValueChange,
}) => {
  const renderTextField = (label: string, name: keyof PopupConfig) => (
    <TextField
      label={label}
      name={name}
      type="text"
      value={config[name].replace("px", "")}
      onChange={(e) => handleValueChange(e as ChangeEvent<HTMLInputElement>, name)}
      isMeasurement={true}
    />
  );

  return (
    <div className="p-4 bg-white border-b-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleSettings}>
        <h2 className="font-semibold">Customize PopUp</h2>
        <ArrowDropdownIcon isOpen={isOpen} width={20} height={20} />
      </div>
      {isOpen && (
        <div className="mt-4 space-y-4">
          {renderTextField("Height", "height")}
          {renderTextField("Width", "width")}
          {renderTextField("Border Width", "borderWidth")}
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
