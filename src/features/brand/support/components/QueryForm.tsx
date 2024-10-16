import React from "react";
import { SupportState } from "../hooks/useSupport";

const QueryForm: React.FC<{
  queryTitle: string;
  question: string;
  topic: string;
  handleChange: (field: keyof SupportState, value: any) => void;
  handleSubmit: () => void;
}> = ({ queryTitle, question, topic, handleChange, handleSubmit }) => {
  return (
    <div className="flex flex-col justify-start items-start flex-grow gap-8 p-8 rounded-2xl bg-white w-full xl:w-1/2">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <p className="text-xl font-medium text-gray-700">Query title</p>
        </div>
        <input
          type="text"
          value={queryTitle}
          onChange={(e) => handleChange("queryTitle", e.target.value)}
          className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full"
          placeholder="Enter the title"
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <p className="text-xl font-medium text-gray-700">Select the topic</p>
        </div>
        <select
          value={topic}
          onChange={(e) => handleChange("topic", e.target.value)}
          className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full"
        >
          <option value="Payment">Payment</option>
          <option value="Referrals">Referrals</option>
          <option value="Campaign creation">Campaign creation</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <p className="text-xl font-medium text-gray-700">Add your question</p>
        </div>
        <textarea
          value={question}
          onChange={(e) => handleChange("question", e.target.value)}
          className="h-32 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full"
          placeholder="Enter your question"
        />
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={handleSubmit}
          className="h-12 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QueryForm;
