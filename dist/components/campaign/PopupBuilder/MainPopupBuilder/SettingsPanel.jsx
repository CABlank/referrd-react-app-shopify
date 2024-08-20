import React from "react";
import ColorField from "../../CommonComponents/ColorField";
import TextField from "../../CommonComponents/TextField";
import ArrowDropdownIcon from "../../../Icons/ArrowDropdownIcon";
import SelectField from "../../CommonComponents/SelectField";
export var initialDesktopConfigStep1 = {
    backgroundColor: "#af9292",
    height: "320px",
    width: "650px",
    borderWidth: "16px",
    ImagePosition: "Right",
};
export var initialDesktopConfigStep2 = {
    backgroundColor: "#ffffff",
    height: "350px",
    width: "400px",
    borderWidth: "16px",
    ImagePosition: "None",
};
export var initialMobileConfigStep1 = {
    backgroundColor: "#af9292",
    height: "480px",
    width: "280px",
    borderWidth: "16px",
    ImagePosition: "Left",
};
export var initialMobileConfigStep2 = {
    backgroundColor: "#ffffff",
    height: "350px",
    width: "300px",
    borderWidth: "16px",
    ImagePosition: "None",
};
var SettingsPanel = function (_a) {
    var isOpen = _a.isOpen, config = _a.config, toggleSettings = _a.toggleSettings, handleConfigChange = _a.handleConfigChange, handleValueChange = _a.handleValueChange;
    var renderTextField = function (label, name) { return (<TextField label={label} name={name} type="text" value={config[name].replace("px", "")} onChange={function (e) {
            return handleValueChange(e, name);
        }} isMeasurement={true}/>); };
    return (<div className="p-4 bg-white border-b-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleSettings}>
        <h2 className="font-semibold">Customize PopUp</h2>
        <ArrowDropdownIcon isOpen={isOpen} width={20} height={20}/>
      </div>
      {isOpen && (<div className="mt-4 space-y-4">
          {renderTextField("Height", "height")}
          {renderTextField("Width", "width")}
          {renderTextField("Border Width", "borderWidth")}
          <ColorField label="Background Color" name="backgroundColor" value={config.backgroundColor} onChange={handleConfigChange}/>
          <SelectField label="Image Position" name="ImagePosition" value={config.ImagePosition} options={["None", "Left", "Right"]} onChange={handleConfigChange}/>
        </div>)}
    </div>);
};
export default SettingsPanel;
