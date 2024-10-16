// pages/brand/[supportId].tsx

import React from "react";
import SupportDetail from "@/features/brand/support/SupportDetail";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import CustomerLayout from "@/pages/layouts/CustomerLayout/CustomerLayout";

const SupportDetailPage: React.FC = () => {
  return (
    <CustomerLayout>
      <SupportDetail />
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  return {
    props: {},
  };
};

export default SupportDetailPage;
