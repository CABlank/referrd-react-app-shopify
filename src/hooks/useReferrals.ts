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

interface ReferralState {
  referrals: Referral[];
  customers: Customer[];
  referralCodes: ReferralCode[];
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const useReferrals = () => {
  const { session, withTokenRefresh } = useSession();
  const [state, setState] = useState<ReferralState>({
    referrals: [],
    customers: [],
    referralCodes: [],
    campaigns: [],
    loading: true,
    error: null,
  });
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (session?.token && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
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

          setState({
            referrals: referralsData,
            customers: customersData,
            referralCodes: referralCodesData,
            campaigns: campaignsData,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error("Error fetching data:", err);
          setState({
            referrals: [],
            customers: [],
            referralCodes: [],
            campaigns: [],
            loading: false,
            error: "Failed to fetch referrals. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, withTokenRefresh]);

  return state;
};

export default useReferrals;
