import React, { useEffect } from "react";
import { useRouter } from "next/router";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import PaymentIndex from "@/features/Customer/Payments/PaymentDashboard";
import ReferralsIndex from "@/features/Customer/Referrals/ReferralsDashboard";
import SharesIndex from "@/features/Customer/Shares/SharesDashboard";
import SummaryReferrals from "@/features/Customer/Referrals/SummaryReferrals";

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
