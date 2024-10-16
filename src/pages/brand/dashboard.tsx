import React from "react";
import DashboardIndex from "../../features/brand/dashboard/DashboardIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";

type DashboardPageProps = {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
};

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return <DashboardIndex {...props} />;
};

export const getServerSideProps: GetServerSideProps<DashboardPageProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DashboardPageProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Hi, there!",
      },
    };
  }

  const session = (result.props as { session?: any })?.session;
  const userName = session?.user?.name || "there";
  const title = `Hi, ${userName}!`;

  return {
    props: {
      ...result.props,
      title,
    },
  };
};

export default DashboardPage;
