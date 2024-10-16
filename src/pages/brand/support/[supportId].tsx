// pages/brand/[supportId].tsx

import React from "react";
import SupportDetail from "@/features/brand/support/SupportDetail";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";

const SupportDetailPage: React.FC = () => {
  return <SupportDetail />;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  return {
    props: {
      ...result.props,
    },
  };
};

export default SupportDetailPage;
