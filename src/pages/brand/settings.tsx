import React from "react";
import SettingsIndex from "../../features/settings/SettingsIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";

interface SettingsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const SettingsPage: React.FC<SettingsProps> = ({ accessToken, refreshToken, userId }) => {
  return <SettingsIndex accessToken={accessToken} refreshToken={refreshToken} userId={userId} />;
};

export const getServerSideProps: GetServerSideProps<SettingsProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SettingsProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Settings",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Settings",
    },
  };
};

export default SettingsPage;
