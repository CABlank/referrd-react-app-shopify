// src/pages/referrals/index.tsx

import React from "react";
import ReferralsIndex from "@/features/customer/referrals/ReferralsIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import CustomerLayout from "@/pages/layouts/CustomerLayout/CustomerLayout";

interface ReferralsPageProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const ReferralsPage: React.FC<ReferralsPageProps> = ({ accessToken, refreshToken, userId }) => {
  return (
    <CustomerLayout>
      <ReferralsIndex accessToken={accessToken} refreshToken={refreshToken} userId={userId} />
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ReferralsPageProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ReferralsPageProps>> => {
  return {
    props: {
      title: "Referrals",
    },
  };
};

export default ReferralsPage;
