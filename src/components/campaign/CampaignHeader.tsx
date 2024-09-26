import React from "react";
import Link from "next/link";
import SaveButton from "./SaveButton";
import { useRouter } from "next/router";

interface CampaignHeaderProps {
  saving: boolean;
  handleSaveChanges: (e: React.FormEvent) => void;
  isSaveDisabled: boolean; // New prop to control the save button
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  saving,
  handleSaveChanges,
  isSaveDisabled,
}) => {
  const router = useRouter();
  const { shop, host, id_token } = router.query; // Extract existing query parameters

  let campaignsUrl = "/brand/campaigns";

  // If the environment is a Shopify store, append the required query parameters
  if (shop || host || id_token) {
    const urlObj = new URL(window.location.origin + campaignsUrl);
    if (shop) urlObj.searchParams.set("shop", shop as string);
    if (host) urlObj.searchParams.set("host", host as string);
    if (id_token) urlObj.searchParams.set("id_token", id_token as string);

    campaignsUrl = urlObj.toString().replace(window.location.origin, "");
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-start items-center relative gap-2">
        <Link
          href={campaignsUrl}
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
      <SaveButton
        saving={saving}
        handleSaveChanges={handleSaveChanges}
        disabled={isSaveDisabled} // Pass the disabled status to SaveButton
      />
    </div>
  );
};

export default CampaignHeader;
