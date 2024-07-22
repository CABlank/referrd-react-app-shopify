import React from "react";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import useSupportDetail from "../../../hooks/useSupportDetail";
var SupportDetail = function () {
    var _a = useSupportDetail(), _b = _a.state, query = _b.query, newMessage = _b.newMessage, loading = _b.loading, error = _b.error, handleNewMessageChange = _a.handleNewMessageChange, handleNewMessageSubmit = _a.handleNewMessageSubmit, handleStatusChange = _a.handleStatusChange, combinedMessages = _a.combinedMessages;
    if (loading) {
        return <LoadingOverlay />;
    }
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }
    return (<div className="support-detail-container">
      {query ? (<div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-gray-700">
            Query: {query.title}
          </h2>

          <div className="flex flex-col gap-4">
            {combinedMessages.map(function (message) { return (<div key={message.id} className={"flex ".concat(message.user_created === query.user_created
                    ? "justify-start"
                    : "justify-end")}>
                <div className={"max-w-md p-4 rounded-lg ".concat(message.user_created === query.user_created
                    ? "bg-blue-100 text-left"
                    : "bg-green-100 text-right")}>
                  <p className="text-sm text-gray-700">{message.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.date_created).toLocaleString()}
                  </p>
                </div>
              </div>); })}
          </div>
          <textarea value={newMessage} onChange={function (e) { return handleNewMessageChange(e.target.value); }} className="h-32 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full" placeholder="Enter your message"/>
          <button onClick={handleNewMessageSubmit} className="h-12 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">
            Send
          </button>
        </div>) : (<p>No query found.</p>)}
    </div>);
};
export default SupportDetail;
