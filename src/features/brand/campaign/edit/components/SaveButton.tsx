import React from "react";
import Spinner from "../../../../../components/common/Spinner"; // Import the Spinner component

interface SaveButtonProps {
  saving: boolean;
  handleSaveChanges: (e: React.FormEvent) => void;
  disabled?: boolean; // Optional disabled prop
}

const SaveButton: React.FC<SaveButtonProps> = ({
  saving,
  handleSaveChanges,
  disabled = false, // Default to false if not provided
}) => {
  return (
    <div className="flex flex-col items-end">
      <button
        className={`px-4 py-2 rounded-md flex items-center justify-center ${
          saving || disabled ? "bg-gray-300" : "bg-[#47B775] text-white"
        }`}
        onClick={handleSaveChanges}
        disabled={saving || disabled} // Disable if saving or disabled prop is true
      >
        {saving ? (
          <>
            <Spinner /> {/* Show Spinner when saving */}
            <span className="ml-2">Saving...</span>
          </>
        ) : (
          "Save Changes"
        )}
      </button>

      {/* Display a message if the button is disabled */}
      {disabled && !saving && (
        <p className="text-red-500 mt-2">Please complete all steps before saving changes.</p>
      )}
    </div>
  );
};

export default SaveButton;
