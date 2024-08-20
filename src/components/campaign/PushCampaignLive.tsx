import React, { useState } from "react";
import { updateCampaignStatus } from "../../services/campaign/campaign";
import Spinner from "../common/Spinner";
import ArrowDropdownIcon from "../Icons/ArrowDropdownIcon";

interface CampaignStatusSelectorProps {
  campaignId: number;
  token: string;
  currentStatus: "Live" | "Draft" | "Ended";
}

const CampaignStatusSelector: React.FC<CampaignStatusSelectorProps> = ({
  campaignId,
  token,
  currentStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [pendingStatus, setPendingStatus] = useState(currentStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusChange = async () => {
    if (pendingStatus === selectedStatus) return;

    setLoading(true);
    try {
      await updateCampaignStatus(campaignId, pendingStatus, token);
      setSelectedStatus(pendingStatus);
    } catch (error) {
      console.error("Failed to update campaign status", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Define classes based on the selected status
  const statusColors = {
    Draft: {
      border: "border-blue-500",
      button: "bg-blue-500 hover:bg-blue-600",
    },
    Live: {
      border: "border-green-500",
      button: "bg-green-500 hover:bg-green-600",
    },
    Ended: {
      border: "border-red-500",
      button: "bg-red-500 hover:bg-red-600",
    },
  };

  return (
    <div className="relative items-center p-6 bg-white rounded-lg shadow-md w-full my-12">
      <h2 className="flex text-xl font-semibold text-green-500 text-center mb-4 self-start">
        6. Campaign Status
      </h2>
      <hr className="border-gray-200 mb-6" />
      <p className="text-center text-gray-600 mb-6">
        Select the current status of your campaign.
      </p>

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}

      <div
        className={`${
          loading ? "blur-sm" : ""
        } relative flex flex-col items-center`}
      >
        <div className="relative inline-block w-full max-w-md">
          <select
            value={pendingStatus}
            onChange={(e) =>
              setPendingStatus(e.target.value as "Live" | "Draft" | "Ended")
            }
            onClick={handleDropdownToggle}
            className={`w-full px-4 py-2 pr-10 bg-white ${
              statusColors[pendingStatus].border
            } border rounded-lg shadow-sm appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-${pendingStatus.toLowerCase()}-500 focus:border-transparent`}
            disabled={loading}
          >
            <option value="Draft">Draft</option>
            <option value="Live">Live</option>
            <option value="Ended">Ended</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ArrowDropdownIcon isOpen={isDropdownOpen} />
          </div>
        </div>

        <button
          onClick={handleStatusChange}
          className={`px-4 py-2 mt-4 ${
            pendingStatus !== selectedStatus
              ? statusColors[pendingStatus].button
              : "bg-gray-300"
          } text-white rounded-lg transition-colors duration-300`}
          disabled={pendingStatus === selectedStatus || loading}
        >
          {loading ? "Saving..." : "Confirm Status Change"}
        </button>
      </div>
    </div>
  );
};

export default CampaignStatusSelector;
