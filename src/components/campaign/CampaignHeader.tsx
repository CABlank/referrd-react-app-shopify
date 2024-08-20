import React from "react";
import Link from "next/link";
import SaveButton from "./SaveButton";

interface CampaignHeaderProps {
  saving: boolean;
  handleSaveChanges: (e: React.FormEvent) => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  saving,
  handleSaveChanges,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-start items-center relative gap-2">
        <Link
          href="/brand/campaigns"
          className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50"
        >
          Campaigns
        </Link>
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M5.75 3.5L10.25 8L5.75 12.5"
            stroke="black"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50">
          Edit Campaign
        </p>
      </div>

      {/* Save button */}
      <SaveButton saving={saving} handleSaveChanges={handleSaveChanges} />
    </div>
  );
};

export default CampaignHeader;
