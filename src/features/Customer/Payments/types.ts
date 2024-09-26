// src/features/Brand/Payments/types.ts

export interface MappedPayment {
  id: number;
  referral_uuid: string;
  campaign_uuid: string;
  total_price: string;
  date_created: string | number | Date;
  order_number: any;
  referrer: string;
  campaign: string;
  referralCashback: number;
  date: string;
  order: string;
  status?: "Approved" | "Declined" | "Pending";
}
