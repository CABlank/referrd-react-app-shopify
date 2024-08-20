import React from "react";

interface DeletePopupProps {
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  onCancel,
  onConfirm,
  deleting,
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
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
