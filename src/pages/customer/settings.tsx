import React from "react";
import SettingsIndex from "../../features/settings/SettingsIndex";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";

interface SettingsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const SettingsPage: React.FC<SettingsProps> = ({ accessToken, refreshToken, userId }) => {
  return (
    <CustomerLayout>
      <SettingsIndex accessToken={accessToken} refreshToken={refreshToken} userId={userId} />
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps<SettingsProps> = async (): Promise<
  GetServerSidePropsResult<SettingsProps>
> => {
  return {
    props: {
      title: "Settings",
    },
  };
};

export default SettingsPage;
