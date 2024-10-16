// features/Brand/SupportIndex.tsx

import React from "react";
import useSupport from "./hooks/useSupport";
import QueryForm from "./components/QueryForm";
import QueryList from "./components/QueryList";

interface SupportProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const SupportIndex: React.FC<SupportProps> = ({
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

export default SupportIndex;
