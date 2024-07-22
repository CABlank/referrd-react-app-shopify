import React from "react";
import useSupport from "../../../hooks/useSupport";
import QueryForm from "../../../components/Support/QueryForm";
import QueryList from "../../../components/Support/QueryList";

const Support: React.FC = () => {
  const {
    state: { queries, loading, error, queryTitle, question, topic },
    handleChange,
    handleSubmit,
    handleQuerySelect,
  } = useSupport();

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

export default Support;
