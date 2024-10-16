// features/Brand/Support/SupportDetail.tsx

import React from "react";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import useSupportDetail from "./hooks/useSupportDetail";
import SupportMessageList from "./components/SupportMessageList";
import Link from "next/link";
import { useRouter } from "next/router";

const SupportDetail: React.FC = () => {
  const {
    state: { query, newMessage, loading, error },
    handleNewMessageChange,
    handleNewMessageSubmit,
    combinedMessages,
  } = useSupportDetail();

  const router = useRouter();
  const { shop, host, id_token } = router.query;

  let supportUrl = "";

  // Build the base URL depending on the user role
  if (router.pathname.includes("brand")) {
    supportUrl = `/brand/support`;
  } else {
    supportUrl = `/customer/support`;
  }

  if (shop || host || id_token) {
    const urlObj = new URL(window.location.origin + supportUrl);
    if (shop) urlObj.searchParams.set("shop", shop as string);
    if (host) urlObj.searchParams.set("host", host as string);
    if (id_token) urlObj.searchParams.set("id_token", id_token as string);

    supportUrl = urlObj.toString().replace(window.location.origin, "");
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="support-detail-container">
      <div className="flex justify-start items-center relative gap-2">
        <Link
          href={supportUrl}
          className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50"
        >
          Support
        </Link>
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M5.75 3.5L10.25 8L5.75 12.5"
            stroke="black"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50">
          Support Detail
        </p>
      </div>
      {query ? (
        <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-gray-700">
            Query: {query.title}
          </h2>

          <SupportMessageList
            messages={combinedMessages}
            currentUser={query.user_created}
          />

          <textarea
            value={newMessage}
            onChange={(e) => handleNewMessageChange(e.target.value)}
            className="h-32 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full"
            placeholder="Enter your message"
          />
          <button
            onClick={handleNewMessageSubmit}
            className="h-12 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Send
          </button>
        </div>
      ) : (
        <p>No query found.</p>
      )}
    </div>
  );
};

export default SupportDetail;
