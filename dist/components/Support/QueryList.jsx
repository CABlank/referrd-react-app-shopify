import React from "react";
import QuestionItem from "./QuestionItem";
var QueryList = function (_a) {
    var queries = _a.queries, loading = _a.loading, error = _a.error, handleQuerySelect = _a.handleQuerySelect;
    return (<div className="flex flex-col w-full justify-start items-start flex-grow p-3 rounded-2xl bg-white xl:w-1/2 overflow-x-auto mobile-scroll">
      <div className="flex justify-between items-start opacity-90 py-4 bg-white sm:w-full w-[640px] pr-4">
        <p className="w-28 text-base font-bold text-center text-[#10ad1b]">
          Title
        </p>
        <p className="w-28 text-base font-bold text-center text-[#10ad1b]">
          Question
        </p>
        <p className="w-28 text-base font-bold text-center text-[#10ad1b]">
          Topic
        </p>
        <p className="w-28 text-base font-bold text-center text-[#10ad1b]">
          Valid
        </p>
      </div>
      {loading ? (<p className="text-gray-700"></p>) : error ? (<p className="text-red-600">{error}</p>) : queries.length === 0 ? (<p className="text-gray-700">No support tickets found.</p>) : (queries.map(function (query) { return (<div key={query.id} onClick={function () { return handleQuerySelect(query); }} className="w-full cursor-pointer">
            <QuestionItem title={query.title} question={query.question} topic={query.topic} status={query.status}/>
          </div>); }))}
    </div>);
};
export default QueryList;
