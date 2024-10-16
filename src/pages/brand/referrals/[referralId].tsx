// src/pages/brand/referrals/[referralId].tsx

import React from "react";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import ReferralDetails from "@/features/brand/referrals/ReferralDetails";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";

interface ReferralPageProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const ReferralPage: React.FC<ReferralPageProps> = () => {
  return <ReferralDetails />;
};

export const getServerSideProps: GetServerSideProps<ReferralPageProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ReferralPageProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Referral Details",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Referral Details",
    },
  };
};

export default ReferralPage;
