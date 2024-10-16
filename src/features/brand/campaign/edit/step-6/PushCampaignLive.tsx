import React, { useState } from "react";
import { updateCampaignStatus } from "./updateCampaignTask"; // Use updateCampaignStatus here
import Spinner from "../../../../../components/common/Spinner";
import ArrowDropdownIcon from "../../../../../components/icons/ArrowDropdownIcon";
import { useRouter } from "next/router";

interface CampaignStatusSelectorProps {
  campaignId: number;
  token: string;
  currentStatus: "Live" | "Draft" | "Ended";
  handleSaveChanges: () => Promise<void>; // Receive the save function as a prop
  isSaveDisabled: boolean; // Prop to control the disabled state
}

const Modal: React.FC<{
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}> = ({ onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Status Change</h2>
        <p className="mb-6">Are you sure you want to change the status and save the campaign?</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            disabled={loading} // Disable the button if loading
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CampaignStatusSelector: React.FC<CampaignStatusSelectorProps> = ({
  campaignId,
  token,
  currentStatus,
  handleSaveChanges,
  isSaveDisabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [pendingStatus, setPendingStatus] = useState(currentStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Handle status change and save campaign
  const handleStatusChange = async () => {
    setLoading(true);
    try {
      // First, save the entire campaign (if there are other changes)
      await handleSaveChanges();

      // Then, update the campaign status specifically
      await updateCampaignStatus(campaignId, pendingStatus, token); // Call updateCampaignStatus

      // Update the local state with the new status
      setSelectedStatus(pendingStatus);
      setIsModalOpen(false); // Close the modal

      /* Redirect after successful save
      const { shop, host, id_token } = router.query;
      let campaignsUrl = "/brand/campaigns";

      // If shopify-related params are present, append them to the URL
      if (shop || host || id_token) {
        const urlObj = new URL(window.location.origin + campaignsUrl);
        if (shop) urlObj.searchParams.set("shop", shop as string);
        if (host) urlObj.searchParams.set("host", host as string);
        if (id_token) urlObj.searchParams.set("id_token", id_token as string);
        campaignsUrl = urlObj.toString().replace(window.location.origin, "");
      }

      router.push(campaignsUrl);
      */
    } catch (error) {
      console.error("Failed to save campaign status", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative items-center p-6 bg-white rounded-lg shadow-md w-full my-12 mb-48">
      <h2 className="flex text-xl font-semibold text-green-500 text-center mb-4 self-start">
        6. Campaign Status
      </h2>
      <hr className="border-gray-200 mb-6" />
      <p className="text-center text-gray-600 mb-6">Select the current status of your campaign.</p>

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}

      <div className={`${loading ? "blur-sm" : ""} relative flex flex-col items-center`}>
        <div className="relative inline-block w-full max-w-md">
          <select
            value={pendingStatus}
            onChange={(e) => setPendingStatus(e.target.value as "Live" | "Draft")}
            onClick={handleDropdownToggle}
            className={`w-full px-4 py-2 pr-10 bg-white border rounded-lg shadow-sm appearance-none hover:border-gray-400 focus:outline-none`}
            disabled={loading}
          >
            <option value="Draft">Draft</option>
            <option value="Live">Live</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ArrowDropdownIcon isOpen={isDropdownOpen} />
          </div>
        </div>

        {/* Confirm Status Change Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-4 py-2 mt-4 ${
            isSaveDisabled || pendingStatus === selectedStatus
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-lg transition-colors duration-300`}
          disabled={isSaveDisabled || pendingStatus === selectedStatus || loading}
        >
          Confirm Status Change
        </button>

        {/* Show a message if saving is disabled */}
        {isSaveDisabled && (
          <p className="text-red-500 mt-4">Please complete all steps before changing the status.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleStatusChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CampaignStatusSelector;
