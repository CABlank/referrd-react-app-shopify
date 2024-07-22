import React from "react";
import useSupport from "../../../hooks/useSupport";
import QueryForm from "../../../components/Support/QueryForm";
import QueryList from "../../../components/Support/QueryList";
var Support = function () {
    var _a = useSupport(), _b = _a.state, queries = _b.queries, loading = _b.loading, error = _b.error, queryTitle = _b.queryTitle, question = _b.question, topic = _b.topic, handleChange = _a.handleChange, handleSubmit = _a.handleSubmit, handleQuerySelect = _a.handleQuerySelect;
    return (<div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto gap-8 p-4">
      <QueryForm queryTitle={queryTitle} question={question} topic={topic} handleChange={handleChange} handleSubmit={handleSubmit}/>
      <QueryList queries={queries} loading={loading} error={error} handleQuerySelect={handleQuerySelect}/>
    </div>);
};
export default Support;
