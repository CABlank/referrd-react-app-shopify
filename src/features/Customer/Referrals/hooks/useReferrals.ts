import { useState, useEffect, useRef } from "react";
import {
  fetchCustomersByUuidReferral,
  fetchMainCustomerByUuidReferral,
} from "../../../../services/referrals/referrals";
import { useSession } from "../../../../context/SessionContext";
import { fetchUserData } from "../../../../services/auth/auth";

interface Customer {
  length: number;
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

interface CustomerState {
  customers: Customer[];
  mainCustomerData: Customer[];
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
    mainCustomerData: [],
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
          // First, use withTokenRefresh to fetch the customer UUID securely
          const customerUUID = await withTokenRefresh(
            async (token) => {
              // Fetch the customer data using the current or refreshed token
              const userData = await fetchUserData(token);
              return userData;
            },
            refreshToken, // If needed, provide a refresh token here
            userId // User ID to help identify which token to refresh, if required
          );

          if (customerUUID?.uuid) {
            const [customersData, mainCustomerResponse] = await Promise.all([
              withTokenRefresh(
                (token) =>
                  fetchCustomersByUuidReferral(token, customerUUID.uuid),
                refreshToken,
                userId
              ),
              withTokenRefresh(
                (token) =>
                  fetchMainCustomerByUuidReferral(token, customerUUID.uuid),
                refreshToken,
                userId
              ),
            ]);

            const mainCustomerData = mainCustomerResponse || null; // Extract the first customer object

            setState({
              customers: customersData || [],
              mainCustomerData, // Set main customer object
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
            mainCustomerData: [],
            loading: false,
            error:
              "Failed to fetch customers or main customer data. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, accessToken, refreshToken, userId, withTokenRefresh]);

  return state;
};

export default useCustomers;
