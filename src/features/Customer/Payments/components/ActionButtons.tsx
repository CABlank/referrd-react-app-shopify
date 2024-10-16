// src/features/Brand/Payments/components/ActionButtons.tsx

import React from "react";
import DeclineIcon from "../../../../components/icons/DeclineIcon";
import AcceptIcon from "../../../../components/icons/AcceptIcon";
import SeparatorIcon from "../../../../components/icons/SeparatorIcon";
import { MappedPayment } from "../types";

interface ActionButtonsProps {
  payment: MappedPayment;
  handlePaymentAction: (paymentId: number, action: "Approved" | "Declined") => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ payment, handlePaymentAction }) => {
  const statusStyles = {
    Approved: {
      container: "text-[#10ad1b] bg-[#d6f5d6]/5 border-[#10ad1b]",
      text: "text-[#10ad1b]",
    },
    Declined: {
      container: "text-[#d52121] bg-[#f5d6d6]/5 border-[#d52121]",
      text: "text-[#d52121]",
    },
    Pending: {
      container: "text-gray-500 bg-gray-200/5 border-gray-500",
      text: "text-gray-500",
    },
  };

  const status = payment.status as keyof typeof statusStyles;

  if (status === "Pending") {
    return (
      <div className="flex justify-start items-center gap-2">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handlePaymentAction(payment.id ?? 0, "Approved")}
        >
          <p className="text-base text-[#10ad1b]">Approve</p>
          <AcceptIcon />
        </div>
        <SeparatorIcon />
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handlePaymentAction(payment.id ?? 0, "Declined")}
        >
          <p className="text-base text-[#d52121]">Decline</p>
          <DeclineIcon />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`flex items-center gap-2 ${statusStyles[status].container} rounded-[40px] px-4 py-0.5 border`}
      >
        <p className={`text-base ${statusStyles[status].text}`}>{payment.status}</p>
      </div>
    );
  }
};

export default ActionButtons;
