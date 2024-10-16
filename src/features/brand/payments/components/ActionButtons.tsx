import React, { useState, useEffect } from "react";
import DeclineIcon from "../../../../components/icons/DeclineIcon";
import AcceptIcon from "../../../../components/icons/AcceptIcon";
import SeparatorIcon from "../../../../components/icons/SeparatorIcon";
import { MappedPayment } from "../types";
import EditIcon from "../../../../components/icons/EditIcon";

// Define valid status types
type PaymentStatus = "Approved" | "Declined" | "Pending";

interface ActionButtonsProps {
  payment: MappedPayment;
  handlePaymentAction: (paymentId: number, action: PaymentStatus) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ payment, handlePaymentAction }) => {
  const [showOverride, setShowOverride] = useState(false);

  // Define the status styles
  const statusStyles: Record<PaymentStatus, { container: string; text: string }> = {
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

  // Ensure the status is a valid PaymentStatus or handle unexpected cases
  const status = payment.status as PaymentStatus;

  // Reset showOverride when status changes
  useEffect(() => {
    setShowOverride(false);
  }, [payment.status]);

  // Render action buttons based on the payment status
  if (status === "Pending") {
    return (
      <div className="flex justify-start items-center gap-2">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            handlePaymentAction(payment.id ?? 0, "Approved");
          }}
        >
          <p className="text-sm text-[#10ad1b]">Approve</p>
          <AcceptIcon />
        </div>
        <SeparatorIcon />
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            handlePaymentAction(payment.id ?? 0, "Declined");
          }}
        >
          <p className="text-sm text-[#d52121]">Decline</p>
          <DeclineIcon />
        </div>
      </div>
    );
  } else if (status === "Declined") {
    return (
      <div className="flex justify-start items-center gap-2">
        <p className="text-sm text-[#d52121]">Declined</p>
        {!showOverride ? (
          <div className="cursor-pointer" onClick={() => setShowOverride(true)}>
            <EditIcon />
          </div>
        ) : (
          <div className="flex items-center gap-1 cursor-pointer">
            <SeparatorIcon />
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                handlePaymentAction(payment.id ?? 0, "Approved");
              }}
            >
              <p className="text-sm text-[#10ad1b]">Change to Approve</p>
              <AcceptIcon />
            </div>
          </div>
        )}
      </div>
    );
  } else if (status === "Approved") {
    return (
      <div className="flex justify-start items-center gap-2">
        <p className="text-sm text-[#10ad1b]">Approved</p>
        {!showOverride ? (
          <div className="cursor-pointer" onClick={() => setShowOverride(true)}>
            <EditIcon />
          </div>
        ) : (
          <div className="flex items-center gap-1 cursor-pointer">
            <SeparatorIcon />
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                handlePaymentAction(payment.id ?? 0, "Declined");
              }}
            >
              <p className="text-sm text-[#d52121]">Change to Decline</p>
              <DeclineIcon />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // Fallback for unexpected or invalid statuses
    return (
      <div className="flex items-center gap-2 bg-gray-300 rounded-[40px] px-4 py-0.5 border">
        <p className="text-sm text-gray-600">Unknown Status</p>
      </div>
    );
  }
};

export default ActionButtons;
