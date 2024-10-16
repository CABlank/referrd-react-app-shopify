import React, { useState } from "react";

const CampaignDetail: React.FC<{
  campaign: any;
  className?: string;
  handleChange: any;
}> = ({ campaign, className, handleChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-white p-4 shadow rounded-lg border border-gray-200 ${className}`}
    >
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-green-500">
          1. Campaign Details
        </h2>

        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Campaign name <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={campaign.name}
            placeholder="Campaign name"
            className="w-full form-input px-4 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Start date <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={campaign.startDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Close date <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              name="closeDate"
              value={campaign.closeDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Company <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={campaign.company}
            placeholder="Company name"
            className="w-full form-input px-4 py-2 border border-gray-300 rounded-md"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
