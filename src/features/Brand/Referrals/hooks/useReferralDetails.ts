import { useState, useEffect, useRef } from "react";
import {
  fetchCustomers,
  fetchCampaigns,
  fetchCompanies,
} from "../../../../services/referrals/referrals";
import { useSession } from "../../../../context/SessionContext";

export interface Customer {
  id: number;
  date_created: string;
  uuid: string;
  name: string;
  email: string;
  mobile: string;
  referred_by: string;
  conversion_count: number;
  signup_count: number;
  location: string;
  click_count: number;
  company_id: string;
  campaign_uuid: string;
}

export interface Campaign {
  uuid: any;
  id: number;
  name: string;
}

interface ReferralDetailsState {
  customer: Customer | null;
  campaign: Campaign | null;
  conversions: Customer[];
  shares: Customer[];
  loading: boolean;
  error: string | null;
}

const useReferralDetails = (referralId: string | string[] | undefined) => {
  const { session, withTokenRefresh } = useSession();
  const [state, setState] = useState<ReferralDetailsState>({
    customer: null,
    campaign: null,
    conversions: [],
    shares: [],
    loading: true,
    error: null,
  });

  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (session?.accessToken && referralId && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;

        try {
          // Fetch companies to determine the correct company UUID
          const companiesData = await withTokenRefresh((token) =>
            fetchCompanies(token)
          );
          const companyUUID = companiesData[0]?.UUID;

          if (!companyUUID) {
            throw new Error("Company UUID is undefined");
          }

          // Fetch customers and campaigns
          const [customersData, campaignsData] = await Promise.all([
            withTokenRefresh((token) => fetchCustomers(token, companyUUID)),
            withTokenRefresh((token) => fetchCampaigns(token)),
          ]);

          // Select the specific customer using the referral ID (which is actually customer UUID)
          const selectedCustomer = customersData.find(
            (customer: Customer) => customer.uuid === referralId
          );

          if (selectedCustomer) {
            const relatedCampaign = campaignsData.find(
              (campaign: Campaign) =>
                campaign.uuid === selectedCustomer.campaign_uuid
            );

            // Separate the customers into conversions and shares
            const referredCustomers = customersData.filter(
              (customer: Customer) =>
                customer.referred_by === selectedCustomer.uuid
            );

            const conversions = referredCustomers.filter(
              (customer: { conversion_count: number }) =>
                customer.conversion_count > 0
            );

            const shares = referredCustomers.filter(
              (customer: { conversion_count: number }) =>
                customer.conversion_count === 0
            );

            setState({
              customer: selectedCustomer,
              campaign: relatedCampaign || null,
              conversions,
              shares,
              loading: false,
              error: null,
            });
          } else {
            setState({
              customer: null,
              campaign: null,
              conversions: [],
              shares: [],
              loading: false,
              error: "Referral not found.",
            });
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setState({
            customer: null,
            campaign: null,
            conversions: [],
            shares: [],
            loading: false,
            error: "Failed to fetch referral details. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, referralId, withTokenRefresh]);

  return state;
};

export default useReferralDetails;
