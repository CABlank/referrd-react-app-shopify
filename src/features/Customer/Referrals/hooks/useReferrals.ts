import { useState, useEffect, useRef } from "react";
import {
  fetchCustomersByUuidReferral,
  fetchCampaigns,
} from "../../../../services/referrals/referrals";
import { useSession } from "../../../../context/SessionContext";
import { fetchUserData } from "../../../../services/auth/auth";

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
  id: string;
  name: string;
}

interface CustomerState {
  customers: Customer[];
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
          // Fetch UUID of the logged-in user (customer)
          const customerUUID = await fetchUserData(session?.token || "");
          console.log("Fetched customerUUID:", customerUUID?.uuid);

          if (customerUUID?.uuid) {
            // Fetch customers and campaigns using the customer UUID (referred_by logic)
            const [customersData] = await Promise.all([
              withTokenRefresh(
                (token) =>
                  fetchCustomersByUuidReferral(token, customerUUID.uuid),
                refreshToken,
                userId
              ),
            ]);

            // Set the fetched data into the state
            setState({
              customers: customersData || [],
              loading: false,
              error: null,
            });
          } else {
            throw new Error("Customer UUID is not available.");
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setState({
            customers: [],
            loading: false,
            error: "Failed to fetch customers or campaigns. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, accessToken, refreshToken, userId, withTokenRefresh]);

  return state;
};

export default useCustomers;
