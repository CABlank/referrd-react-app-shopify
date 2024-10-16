// pages/support/index.tsx

import React from "react";
import SupportIndex from "../../../features/brand/support/SupportIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import CustomerLayout from "@/pages/layouts/CustomerLayout/CustomerLayout";

interface SupportProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const SupportPage: React.FC<SupportProps> = (props) => {
  return (
    <CustomerLayout>
      {" "}
      <SupportIndex {...props} />
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps<SupportProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SupportProps>> => {
  return {
    props: {
      title: "Support",
    },
  };
};

export default SupportPage;
