import React from "react";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import useSettings from "./hooks/useSettings";
import SettingsForm from "./components/SettingsForm";

interface SettingsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const SettingsIndex: React.FC<SettingsProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const { settings, loading, error, handleChange, handleSave } = useSettings({
    accessToken,
    refreshToken,
    userId,
  });

  return (
    <div
      className={`relative flex justify-center items-center ${
        loading ? "h-screen" : ""
      }`}
    >
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
          <LoadingOverlay />
        </div>
      )}
      <SettingsForm
        settings={settings}
        error={error}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </div>
  );
};

export default SettingsIndex;
