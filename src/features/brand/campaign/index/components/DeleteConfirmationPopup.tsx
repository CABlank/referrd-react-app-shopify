import React from "react";

interface DeleteConfirmationPopupProps {
  onDelete: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  onDelete,
  onCancel,
  isDeleting,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg z-60">
        <p>Are you sure you want to delete this campaign?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
