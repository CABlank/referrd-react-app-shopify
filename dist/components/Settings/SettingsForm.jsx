import React from "react";
import BrandInformationForm from "./BrandInformationForm";
import NotificationsForm from "./NotificationsForm";
var SettingsForm = function (_a) {
    var settings = _a.settings, error = _a.error, handleChange = _a.handleChange, handleSave = _a.handleSave;
    return (<div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto gap-8 p-4 mb-20">
      <BrandInformationForm settings={settings} error={error} handleChange={handleChange}/>
      <div className="flex flex-col gap-8 w-full lg:w-1/2">
        <NotificationsForm settings={settings} handleChange={handleChange}/>
        <button onClick={handleSave} className="h-12 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 mt-4 lg:w-1/6">
          Save
        </button>
      </div>
    </div>);
};
export default SettingsForm;
