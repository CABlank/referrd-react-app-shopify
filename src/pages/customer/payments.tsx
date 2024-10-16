// src/pages/brand/payments.tsx

import React from "react";
import PaymentIndex from "@/features/customer/payments/PaymentIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import CustomerLayout from "@/pages/layouts/CustomerLayout/CustomerLayout";

interface PaymentsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const PaymentsPage: React.FC<PaymentsProps> = ({ accessToken, refreshToken, userId }) => {
  return (
    <CustomerLayout>
      <PaymentIndex accessToken={accessToken} refreshToken={refreshToken} userId={userId} />
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps<PaymentsProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PaymentsProps>> => {
  return {
    props: {
      title: "Payments",
    },
  };
};

export default PaymentsPage;
