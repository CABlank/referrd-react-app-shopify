// src/features/Brand/Payments/hooks/usePayments.ts

import { useState, useEffect, useRef } from "react";
import {
  fetchCompanyUUID,
  fetchPaymentsByCompanyId,
  fetchReferrer,
  fetchCampaignMetadata,
  updatePaymentStatus,
} from "../../../../services/payments/payments";
import { useSession } from "../../../../context/SessionContext";
import { MappedPayment } from "../types";

export const usePayments = (
  accessToken?: string,
  refreshToken?: string,
  userId?: number
) => {
  const { session, withTokenRefresh } = useSession();
  const [payments, setPayments] = useState<MappedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState<
    "Accepted" | "Declined" | null
  >(null);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if ((session?.token || accessToken) && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;

        try {
          const companyUUID = await withTokenRefresh(
            (token) => fetchCompanyUUID(token),
            refreshToken,
            userId
          );

          if (companyUUID) {
            const paymentsData = await withTokenRefresh(
              (token) => fetchPaymentsByCompanyId(companyUUID, token),
              refreshToken,
              userId
            );

            if (paymentsData) {
              const mappedPayments = await Promise.all(
                paymentsData.map(
                  async (payment: {
                    referral_uuid: string;
                    campaign_uuid: string;
                    total_price: string;
                    date_created: string | number | Date;
                    order_number: any;
                  }) => {
                    const referrer = payment.referral_uuid
                      ? await withTokenRefresh(
                          (token) =>
                            fetchReferrer(payment.referral_uuid, token),
                          refreshToken,
                          userId
                        )
                      : null;
                    const campaign = payment.campaign_uuid
                      ? await withTokenRefresh(
                          (token) =>
                            fetchCampaignMetadata(payment.campaign_uuid, token),
                          refreshToken,
                          userId
                        )
                      : null;

                    const referrerName =
                      referrer?.name || referrer?.email || "N/A";
                    const campaignName = campaign ? campaign.name : "N/A";

                    // Calculate referral fee
                    const referralFee = campaign
                      ? calculateReferralFee(
                          payment.total_price,
                          campaign.commission,
                          campaign.commissionType
                        )
                      : 0;

                    return {
                      ...payment,
                      referrer: referrerName,
                      campaign: campaignName,
                      referralCashback: referralFee,
                      date: new Date(payment.date_created).toLocaleString(),
                      order: `#${payment.order_number}`,
                    };
                  }
                )
              );
              setPayments(mappedPayments);
            }
          } else {
            setError("Failed to load company UUID.");
          }
        } catch (err) {
          console.error("Error loading data:", err);
          setError("Failed to load data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [session?.token, accessToken, refreshToken, userId, withTokenRefresh]);

  const calculateReferralFee = (
    totalPrice: string,
    commission: number,
    commissionType: string
  ): number => {
    if (commissionType === "FixedAmount") {
      return commission;
    } else if (commissionType === "Percentage") {
      return (parseFloat(totalPrice) * commission) / 100;
    }
    return 0;
  };

  const handlePaymentAction = async (
    paymentId: number,
    action: "Accepted" | "Declined"
  ) => {
    setLoading(true);
    try {
      await withTokenRefresh(
        (token) => updatePaymentStatus(paymentId, action, token),
        refreshToken,
        userId
      );
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId ? { ...payment, status: action } : payment
        )
      );
    } catch (err) {
      console.error("Error processing payment action:", err);
      setError("Failed to process payment action. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: "Accepted" | "Declined") => {
    if (selectedPayments.length > 0) {
      setLoading(true);
      setButtonClicked(action);
      try {
        await withTokenRefresh(
          (token) =>
            Promise.all(
              selectedPayments.map((paymentId) =>
                updatePaymentStatus(paymentId, action, token)
              )
            ),
          refreshToken,
          userId
        );
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            selectedPayments.includes(payment.id ?? 0)
              ? { ...payment, status: action }
              : payment
          )
        );
        setSelectedPayments([]); // Clear selected payments
        setSelectAll(false); // Reset select all state
      } catch (err) {
        console.error("Error processing bulk payment action:", err);
        setError("Failed to process bulk payment action. Please try again.");
      } finally {
        setLoading(false);
        setTimeout(() => {
          setButtonClicked(null);
        }, 3000); // Reset buttonClicked after 3 seconds
      }
    }
  };

  return {
    payments,
    loading,
    error,
    handlePaymentAction,
    handleBulkAction,
    selectedPayments,
    setSelectedPayments,
    selectAll,
    setSelectAll,
  };
};
