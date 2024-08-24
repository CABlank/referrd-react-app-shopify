import React from "react";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import useSettings from "../../hooks/useSettings";
import SettingsForm from "../../components/Settings/SettingsForm";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker/initialLoadChecker";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

interface SettingsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const Settings: React.FC<SettingsProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const { settings, loading, error, handleChange, handleSave } = useSettings({
    accessToken,
    refreshToken,
    userId,
  });

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}
      <SettingsForm
        settings={settings}
        error={error}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </div>
  );
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

export default Settings;
