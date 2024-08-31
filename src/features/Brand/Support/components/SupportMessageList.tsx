// features/Brand/Support/components/SupportMessageList.tsx

import React from "react";

interface SupportMessageListProps {
  messages: Array<{
    id: string;
    message: string;
    date_created: string;
    user_created: string;
  }>;
  currentUser: string;
}

const SupportMessageList: React.FC<SupportMessageListProps> = ({
  messages,
  currentUser,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.user_created === currentUser
              ? "justify-start"
              : "justify-end"
          }`}
        >
          <div
            className={`max-w-md p-4 rounded-lg ${
              message.user_created === currentUser
                ? "bg-blue-100 text-left"
                : "bg-green-100 text-right"
            }`}
          >
            <p className="text-sm text-gray-700">{message.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(message.date_created).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportMessageList;
