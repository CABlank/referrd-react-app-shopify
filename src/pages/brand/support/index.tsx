import React from "react";
import useSupport from "../../../hooks/useSupport";
import QueryForm from "../../../components/Support/QueryForm";
import QueryList from "../../../components/Support/QueryList";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker";

interface SupportProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const Support: React.FC<SupportProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const {
    state: { queries, loading, error, queryTitle, question, topic },
    handleChange,
    handleSubmit,
    handleQuerySelect,
  } = useSupport({ accessToken, refreshToken, userId });

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto gap-8 p-4">
      <QueryForm
        queryTitle={queryTitle}
        question={question}
        topic={topic}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <QueryList
        queries={queries}
        loading={loading}
        error={error}
        handleQuerySelect={handleQuerySelect}
      />
    </div>
  );
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

export default Support;
