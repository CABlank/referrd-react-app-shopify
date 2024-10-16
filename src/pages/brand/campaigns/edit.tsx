// pages/brand/campaign/edit.tsx

import React from "react";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";
import EditCampaign from "../../../features/brand/campaign/edit/EditCampaign";

interface CampaignEditPageProps {
  accessToken?: string;
  refreshToken?: string;
  title: string;
  userId?: number;
}

const CampaignEditPage: React.FC<CampaignEditPageProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  return (
    <EditCampaign
      accessToken={accessToken}
      refreshToken={refreshToken}
      userId={userId}
      title={"Edit Campaign"}
    />
  );
};

export const getServerSideProps: GetServerSideProps<CampaignEditPageProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CampaignEditPageProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Edit Campaign",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Edit Campaign",
    },
  };
};

export default CampaignEditPage;
