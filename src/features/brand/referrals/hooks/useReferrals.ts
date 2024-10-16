import { useState, useEffect, useRef } from "react";
import {
  fetchCustomers,
  fetchCampaigns,
  fetchCompanies,
} from "../../../../services/referrals/referrals";
import { useSession } from "../../../../context/SessionContext";

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
  company_id: string[]; // Modify to accept an array of company IDs
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
      if ((session?.accessToken || accessToken) && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          // Fetch all companies
          const companiesData: Company[] = await withTokenRefresh(
            (token) => fetchCompanies(token),
            refreshToken,
            userId
          );

          if (!companiesData || companiesData.length === 0) {
            throw new Error("No companies found");
          }

          // Extract all company UUIDs
          const companyUUIDs = companiesData.map((company) => company.UUID);

          if (companyUUIDs.length === 0) {
            throw new Error("No company UUIDs available");
          }

          // Fetch customers for each company UUID and combine the results
          const customersDataPromises = companyUUIDs.map((companyUUID) =>
            withTokenRefresh(
              (token) => fetchCustomers(token, companyUUID),
              refreshToken,
              userId
            )
          );

          // Fetch customers and campaigns concurrently
          const [customersDataArrays, campaignsData] = await Promise.all([
            Promise.all(customersDataPromises),
            withTokenRefresh(
              (token) => fetchCampaigns(token),
              refreshToken,
              userId
            ),
          ]);

          // Flatten the array of customer arrays into a single array
          const customersData = customersDataArrays.flat();

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
