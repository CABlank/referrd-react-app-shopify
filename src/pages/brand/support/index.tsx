// pages/support/index.tsx

import React from "react";
import SupportIndex from "../../../features/brand/support/SupportIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";

interface SupportProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const SupportPage: React.FC<SupportProps> = (props) => {
  return <SupportIndex {...props} />;
};

export const getServerSideProps: GetServerSideProps<SupportProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SupportProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Support",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Support",
    },
  };
};

export default SupportPage;
