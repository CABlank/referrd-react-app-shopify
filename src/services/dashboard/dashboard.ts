import { fetchCustomers, fetchCampaigns } from "../referrals/referrals"; // Import fetchCustomers and fetchCampaigns from the referrals module
import { fetchPaymentsByCompanyId } from "../payments/payments"; // Import fetchPaymentsByCompanyId from the payments module

// Fetch dashboard data
export const fetchDashboardData = async (
  token: string,
  companyUUID: string // Assume you need companyUUID to fetch customers
) => {
  const [customersData, campaignsData, paymentsData] = await Promise.all([
    fetchCustomers(token, companyUUID), // Fetch customers by company UUID
    fetchCampaigns(token), // Fetch campaigns
    fetchPaymentsByCompanyId(companyUUID, token), // Fetch payments by company UUID
  ]);

  return {
    customers: customersData,
    campaigns: campaignsData,
    payments: paymentsData,
  };
};

// Payment interface
export interface Payment {
  date_created: string | number | Date;
  id?: number;
  order_number: string;
  customer_email: string;
  total_price: string;
  total_discounts: string;
  line_items: Array<{
    productName: string;
    quantity: number;
    price: string;
  }>;
  discounts_applied: string | Array<{ code: string }>;
  referral_uuid?: string;
  status: string;
  campaign_uuid?: string;
  company_id?: string;
}

// Customer interface
export interface Customer {
  id: number;
  date_created: string;
  date_updated: string | null;
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

// Company interface
export interface Company {
  id?: number;
  name: string;
  domain: string;
  logo: string | File | null;
  logoUrl?: string;
  date_created: string | number | Date;
  UUID: string;
}

// Campaign interface
export interface Campaign {
  settingsTopbarState?: string;
  settingsPopupState?: string;
  commission: React.ReactNode;
  commissionType: "Fix" | "Percentage";
  id?: number;
  status?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string | null;
  date_updated?: string | null;
  name: string;
  startDate: string | null;
  closeDate: string | null;
  company: string | null;
  terms: string | null;
  discountType: "FixedAmount" | "Percentage";
  discountValue: string | null;
  appliesTo: string | null;
  format: "Popup" | "Both";
  serializedTopbarState?: string;
  serializedPopupState?: string;
  amountFunded?: number;
  url?: string;
  compiledHtml?: string;
  company_id?: string;
  uuid?: string;
}
export { fetchCustomers };
