import React from "react";
import CalendarIcon from "../../../../components/Icons/CalendarIcon";
import DeleteIcon from "../../../../components/Icons/DeleteIcon";
import EditIcon from "../../../../components/Icons/EditIcon";
import CampaignItemIconSmall from "../../../../components/Icons/CampaignItemIconSmall";
import DoubleMoneyIcon from "../../../../components/Icons/DoubleMoneyIcon";
import LiveStatusIcon from "../../../../components/Icons/LiveStatusIcon";
import EndedStatusIcon from "../../../../components/Icons/EndedStatusIcon";
import DraftStatusIcon from "../../../../components/Icons/DraftStatusIcon";
import PendingStatusIcon from "../../../../components/Icons/PendingStatusIcon";
import StripeWrapper from "../../../../components/campaign/StripeWrapper";
import PaymentFormInline from "../../../../components/campaign/PaymentFormInline";

interface CampaignItemProps {
  campaign: any;
  onEdit: () => void;
  onDelete: () => void;
  onShowQR: () => void;
}

const CampaignItem: React.FC<CampaignItemProps> = ({
  campaign,
  onEdit,
  onDelete,
  onShowQR,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Live":
        return <LiveStatusIcon />;
      case "Ended":
        return <EndedStatusIcon />;
      case "Draft":
        return <DraftStatusIcon />;
      case "Pending":
        return <PendingStatusIcon />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Draft":
        return "text-blue-600";
      case "Ended":
        return "text-red-600";
      case "Live":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      key={campaign.id}
      className="relative flex flex-col items-start p-4 gap-2 w-full rounded-2xl bg-white shadow-lg overflow-hidden"
    >
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-3">
          <CampaignItemIconSmall />
          <p className="text-xl font-medium text-gray-800">
            {campaign.name || ""}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <EditIcon />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center w-full">
        <div className="sm:h-[164px] md:h-fit"></div>
        <div className="flex flex-col items-start gap-1.5 w-full">
          <div className="flex justify-between w-full">
            <p className="flex items-center gap-2">
              <DoubleMoneyIcon />
              Amount Available
              <span className="font-bold">${campaign.amountFunded || "0"}</span>
            </p>
            <div className="flex items-center gap-1">
              {getStatusIcon(campaign.status)}
              <p className={`${getStatusColor(campaign.status!)}`}>
                Status:{" "}
                <span className="font-bold">{campaign.status || ""}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <p className="text-sm text-gray-600">
              Created on{" "}
              <span className="font-semibold">
                {campaign.date_created
                  ? new Date(campaign.date_created).toLocaleDateString()
                  : ""}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <p className="text-sm text-gray-600">
              Start Date:{" "}
              <span className="">
                {campaign.startDate
                  ? new Date(campaign.startDate).toLocaleDateString()
                  : ""}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <p className="text-sm text-gray-600">
              Close Date:{" "}
              <span className="">
                {campaign.closeDate
                  ? new Date(campaign.closeDate).toLocaleDateString()
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full items-center mt-4">
        <StripeWrapper>
          <PaymentFormInline campaign={campaign} loading={false} />
        </StripeWrapper>

        <button
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-1.5 rounded bg-[#fef]"
          onClick={onShowQR}
        >
          <span className="text-[#851087] font-semibold">QR Code</span>
        </button>
      </div>
    </div>
  );
};

export default CampaignItem;
