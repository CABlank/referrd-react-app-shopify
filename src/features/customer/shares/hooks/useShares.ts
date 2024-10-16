import { useState, useEffect, useRef } from "react";
import {
  fetchMainCustomerByUuidReferral,
  fetchCompanyByUUID,
} from "../../../../services/referrals/referrals";
import { useSession } from "../../../../context/SessionContext";
import { fetchUserData } from "../../../../services/auth/auth";

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
  company_id: string[]; // Change this to an array to handle multiple company IDs
  campaign_uuid: string;
}

interface Company {
  id?: number;
  name: string;
  domain: string;
  logo: string | File | null;
  logoUrl?: string;
  date_created: string | number | Date;
  UUID: string;
}

interface CustomerState {
  customers: Customer[];
  companies: Company[];
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
    companies: [],
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
            // Fetch customers by referral UUID
            const customersData = await withTokenRefresh(
              (token) =>
                fetchMainCustomerByUuidReferral(token, customerUUID.uuid),
              refreshToken,
              userId
            );


            // Fetch company data for each customer's company_id array
            let companyFetchPromises: Promise<Company>[] = [];
            for (const customer of customersData) {
              const companyIds = Array.isArray(customer.company_id)
                ? customer.company_id
                : [customer.company_id]; // Ensure it's treated as an array

              // Sequentially add fetch promises for each company ID
              for (const companyId of companyIds) {
                companyFetchPromises.push(
                  withTokenRefresh(
                    (token) => fetchCompanyByUUID(token, companyId),
                    refreshToken,
                    userId
                  )
                );
              }
            }

            // Execute all fetch promises sequentially
            const companiesData = await Promise.all(companyFetchPromises);

            // Flatten the nested arrays in companiesData
            const flattenedCompanies = companiesData.flat();


            // Set the state with customers and companies data
            setState({
              customers: customersData,
              companies: flattenedCompanies,
              loading: false,
              error: null,
            });
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setState({
            customers: [],
            companies: [],
            loading: false,
            error: "Failed to fetch customers or companies. Please try again.",
          });
        }
      }
    };

    loadData();
  }, [session, accessToken, refreshToken, userId, withTokenRefresh]);

  return state;
};

export default useCustomers;
