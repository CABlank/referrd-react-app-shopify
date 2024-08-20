import React from "react";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import useSettings from "../../hooks/useSettings";
import SettingsForm from "../../components/Settings/SettingsForm";
var Settings = function () {
    var _a = useSettings(), settings = _a.settings, loading = _a.loading, error = _a.error, handleChange = _a.handleChange, handleSave = _a.handleSave;
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}
      <SettingsForm settings={settings} error={error} handleChange={handleChange} handleSave={handleSave}/>
    </div>);
};
export default Settings;
