import React, { useEffect } from "react";
import { useRouter } from "next/router";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import PaymentIndex from "@/features/customer/payments/PaymentDashboard";
import ReferralsIndex from "@/features/customer/referrals/ReferralsDashboard";
import SharesIndex from "@/features/customer/shares/SharesDashboard";
import SummaryReferrals from "@/features/customer/referrals/SummaryReferrals";

const Dashboard = () => {
  const router = useRouter();

  return (
    <CustomerLayout>
      <div>
        <SummaryReferrals />

        <PaymentIndex />
      </div>
    </CustomerLayout>
  );
};

export default Dashboard;
