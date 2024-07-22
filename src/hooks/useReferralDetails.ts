import { useState, useEffect, useRef } from "react";
import {
  fetchReferrals,
  fetchCustomers,
  fetchReferralCodes,
  fetchCampaigns,
} from "../services/referrals/referrals";
import { useSession } from "../contexts/SessionContext";

// Define interfaces for the data structures
interface Referral {
  id: number;
  date_created: string;
  referrer: number;
  campaign: number;
  referralCode: number;
  location: string;
  spend: number;
  conversion: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Campaign {
  id: number;
  name: string;
}

interface ReferralCode {
  id: number;
  code: string;
}

interface ReferralDetailsState {
  referral: Referral | null;
  customer: Customer | null;
  referralCode: ReferralCode | null;
  campaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const useReferralDetails = (referralsId: string | string[] | undefined) => {
  const { session, withTokenRefresh } = useSession();
  const [state, setState] = useState<ReferralDetailsState>({
    referral: null,
    customer: null,
    referralCode: null,
    campaign: null,
    loading: true,
    error: null,
  });
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (session?.token && referralsId && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true; // Prevents re-fetching
        try {
          const [
            referralsData,
            customersData,
            referralCodesData,
            campaignsData,
          ] = await Promise.all([
            withTokenRefresh((token) => fetchReferrals(token)),
            withTokenRefresh((token) => fetchCustomers(token)),
            withTokenRefresh((token) => fetchReferralCodes(token)),
            withTokenRefresh((token) => fetchCampaigns(token)),
          ]);

          const selectedReferral = referralsData.find(
            (ref: { id: number }) => ref.id === parseInt(referralsId as string)
          );
          if (selectedReferral) {
            setState({
              referral: selectedReferral,
              customer:
                customersData.find(
                  (c: { id: any }) => c.id === selectedReferral.referrer
                ) || null,
              referralCode:
                referralCodesData.find(
                  (code: { id: any }) =>
                    code.id === selectedReferral.referralCode
                ) || null,
              campaign:
                campaignsData.find(
                  (c: { id: any }) => c.id === selectedReferral.campaign
                ) || null,
              loading: false,
              error: null,
            });
          } else {
            setState((prevState) => ({
              ...prevState,
              loading: false,
              error: "Referral not found.",
            }));
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setState({
            referral: null,
            customer: null,
            referralCode: null,
            campaign: null,
            loading: false,
            error: "Failed to fetch referral details. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, referralsId, withTokenRefresh]);

  return state;
};

export default useReferralDetails;
