import React from "react";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";
import CampaignComponent from "../../../features/brand/campaign/index/CampaignIndex";

interface CampaignIndexProps {
  accessToken?: string;
  refreshToken?: string;
  title: string;
  userId?: number;
}

const CampaignIndex: React.FC<CampaignIndexProps> = ({ accessToken, refreshToken, userId }) => {
  return (
    <CampaignComponent
      accessToken={accessToken}
      refreshToken={refreshToken}
      userId={userId}
      title={"Edit Campaign"}
    />
  );
};

export const getServerSideProps: GetServerSideProps<CampaignIndexProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CampaignIndexProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  return {
    props: {
      ...result.props,
      title: "Campaigns",
    },
  };
};

export default CampaignIndex;
