import { useState, useEffect, useRef } from "react";
import {
  fetchCustomers,
  fetchCampaigns,
  fetchCompanies,
} from "../../../../services/referrals/referrals";
import { useSession } from "../../../../context/SessionContext";

// Define interfaces for the data structures
interface Customer {
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

interface Campaign {
  [x: string]: string;
  id: string;
  name: string;
}

interface Company {
  id: number;
  name: string;
  UUID: string;
}

interface CustomerState {
  customers: Customer[];
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const useCustomers = ({
  accessToken,
  refreshToken,
  userId,
}: {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}) => {
  const { session, withTokenRefresh } = useSession();
  const [state, setState] = useState<CustomerState>({
    customers: [],
    campaigns: [],
    loading: true,
    error: null,
  });
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if ((session?.token || accessToken) && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          // Fetch all companies and find the desired one based on some logic
          const companiesData: Company[] = await withTokenRefresh(
            (token) => fetchCompanies(token),
            refreshToken,
            userId
          );

          if (!companiesData || companiesData.length === 0) {
            throw new Error("No companies found");
          }

          // Assume you want to use the first company or have logic to determine which one
          const companyUUID = companiesData[0].UUID; // Replace with logic to select the correct company

          if (!companyUUID) {
            throw new Error("Company UUID is undefined");
          }

          // Fetch customers and campaigns using the company UUID
          const [customersData, campaignsData] = await Promise.all([
            withTokenRefresh(
              (token) => fetchCustomers(token, companyUUID),
              refreshToken,
              userId
            ),
            withTokenRefresh(
              (token) => fetchCampaigns(token),
              refreshToken,
              userId
            ),
          ]);

          // Set the state with the fetched data
          setState({
            customers: customersData,
            campaigns: campaignsData,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error("Error fetching data:", err);
          setState({
            customers: [],
            campaigns: [],
            loading: false,
            error: "Failed to fetch customers. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, accessToken, refreshToken, userId, withTokenRefresh]);

  return state;
};

export default useCustomers;
