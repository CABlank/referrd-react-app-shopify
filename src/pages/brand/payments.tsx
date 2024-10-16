// src/pages/brand/payments.tsx

import React from "react";
import PaymentIndex from "@/features/brand/payments/PaymentIndex";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";

interface PaymentsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const PaymentsPage: React.FC<PaymentsProps> = ({ accessToken, refreshToken, userId }) => {
  return <PaymentIndex accessToken={accessToken} refreshToken={refreshToken} userId={userId} />;
};

export const getServerSideProps: GetServerSideProps<PaymentsProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PaymentsProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Payments",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Payments",
    },
  };
};

export default PaymentsPage;
