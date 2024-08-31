import React from "react";

interface Response {
  id: number;
  message: string;
  created_at: string;
}

interface QuestionItemProps {
  title: string;
  question: string;
  topic: string;
  status: string;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  title,
  question,
  topic,
  status,
}) => (
  <div className="flex justify-between items-center  py-4 sm:w-full w-[640px] pr-4">
    <p className="w-28 text-base text-left text-black/80 text-center">
      {title}
    </p>
    <p className="w-28 text-sm text-gray-700 text-center">{question}</p>
    <p className="w-28 text-sm text-gray-700 text-center">{topic}</p>
    <div className="w-28 flex justify-center items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300 text-center">
      <p className="text-sm text-green-700">{status}</p>
    </div>
  </div>
);

export default QuestionItem;
