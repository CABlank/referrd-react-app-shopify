import React from "react";
import Spinner from "../common/Spinner"; // Import the Spinner component
var SaveButton = function (_a) {
    var saving = _a.saving, handleSaveChanges = _a.handleSaveChanges;
    return (<div className="flex justify-end">
      <button className="px-4 py-2 bg-[#47B775] text-white rounded-md flex items-center justify-center" onClick={handleSaveChanges} disabled={saving} // Disable save button if saving is in progress
    >
        {saving ? (<>
            <Spinner /> {/* Show Spinner when saving */}
            <span className="ml-2">Saving...</span>
          </>) : ("Save Changes")}
      </button>
    </div>);
};
export default SaveButton;
