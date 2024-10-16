import { useState, useEffect, useRef } from "react";
import {
  fetchCompanyUUID,
  fetchPaymentsByReferralUUID,
  fetchReferrer,
  fetchCampaignMetadata,
  updatePaymentStatus,
} from "../../../../services/payments/payments";
import { useSession } from "../../../../context/SessionContext";
import { MappedPayment } from "../types";
import { fetchUserData } from "../../../../services/auth/auth";

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
    "Approved" | "Declined" | null
  >(null);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if ((session?.accessToken || accessToken) && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;

        try {
          // First, fetch the customer UUID securely
          const customerUUID = await withTokenRefresh(
            async (token) => {
              const userData = await fetchUserData(token);
              return userData;
            },
            refreshToken,
            userId
          );



          if (customerUUID?.uuid) {
            const paymentsData = await withTokenRefresh(
              (token) => fetchPaymentsByReferralUUID(customerUUID?.uuid, token),
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
                    // Fetch referrer details if referral_uuid exists
                    const referrer = payment.referral_uuid
                      ? await withTokenRefresh(
                        (token) => fetchReferrer(payment.referral_uuid, token),
                        refreshToken,
                        userId
                      )
                      : null;

                    // Fetch campaign metadata if campaign_uuid exists
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

                    // Calculate referral fee based on the campaign's commission type and amount
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
                      referralCashback: referralFee, // referral cashback added here
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
  }, [session?.accessToken, accessToken, refreshToken, userId, withTokenRefresh]);

  const calculateReferralFee = (
    totalPrice: string,
    commission: number,
    commissionType: string
  ): number => {
    const parsedTotalPrice = parseFloat(totalPrice);

    if (isNaN(parsedTotalPrice)) {
      console.error("Error: Invalid total price:", totalPrice);
      return 0; // Return 0 if the total price is not a valid number
    }

    if (commissionType === "Fix") {
      return commission;
    } else if (commissionType === "Percentage") {
      return (parsedTotalPrice * commission) / 100;
    }
    console.error("Error: Unknown commission type:", commissionType);
    return 0; // Return 0 if the commission type is invalid
  };

  const handlePaymentAction = async (
    paymentId: number,
    action: "Approved" | "Declined"
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

  const handleBulkAction = async (action: "Approved" | "Declined") => {
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
