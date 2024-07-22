import React from "react";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import useSettings from "../../hooks/useSettings";
import SettingsForm from "../../components/Settings/SettingsForm";

// Main Settings component
const Settings: React.FC = () => {
  // Use custom hook to manage settings state and actions
  const { settings, loading, error, handleChange, handleSave } = useSettings();

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {/* Show loading overlay if loading */}
      {loading && <LoadingOverlay />}
      {/* Render SettingsForm with necessary props */}
      <SettingsForm
        settings={settings}
        error={error}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </div>
  );
};

export default Settings;
