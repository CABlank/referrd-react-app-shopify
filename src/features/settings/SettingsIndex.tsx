import React from "react";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import useSettings from "./hooks/useSettings";
import SettingsForm from "./components/SettingsForm";
import { useSession } from "../../context/SessionContext"; // Import the useSession hook

interface SettingsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const SettingsIndex: React.FC<SettingsProps> = ({ accessToken, refreshToken, userId }) => {
  const { session } = useSession(); // Use the session data from useSession
  const { settings, loading, error, handleChange, handleSave } = useSettings({
    accessToken,
    refreshToken,
    userId,
  });

  // Only set role if it is "Customer"
  const role = session?.user?.role === "Customer" ? "Customer" : undefined;

  return (
    <div className={`relative flex justify-center items-center ${loading ? "h-screen" : ""}`}>
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
        role={role} // Pass the role as a prop to SettingsForm, will be "Customer" or undefined
      />
    </div>
  );
};

export default SettingsIndex;
