import React from "react";
import { Settings as SettingsType } from "../../../services/settings";
import BrandInformationForm from "./BrandInformationForm";
import NotificationsForm from "./NotificationsForm";

interface SettingsFormProps {
  settings: SettingsType | null;
  error: string | null;
  handleChange: (field: keyof SettingsType, value: any) => void;
  handleSave: () => void;
  role?: string; // Add the role prop
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  error,
  handleChange,
  handleSave,
  role, // Destructure the role prop
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto gap-8 p-4 mb-20">
      <BrandInformationForm
        settings={settings}
        error={error}
        handleChange={handleChange}
        role={role} // Pass the role to BrandInformationForm
      />
      <div className="flex flex-col gap-8 w-full lg:w-1/2">
        <NotificationsForm settings={settings} handleChange={handleChange} />
        <button
          onClick={handleSave}
          className="h-12 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 mt-4 lg:w-1/6"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;
