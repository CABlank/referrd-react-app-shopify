// src/pages/referrals/index.tsx

import React from "react";
import ReferralsIndex from "@/features/brand/referrals/ReferralsIndex";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

interface ReferralsPageProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const ReferralsPage: React.FC<ReferralsPageProps> = ({ accessToken, refreshToken, userId }) => {
  return <ReferralsIndex accessToken={accessToken} refreshToken={refreshToken} userId={userId} />;
};

export const getServerSideProps: GetServerSideProps<ReferralsPageProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ReferralsPageProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Referrals",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Referrals",
    },
  };
};

export default ReferralsPage;
