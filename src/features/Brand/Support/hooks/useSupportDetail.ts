import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  fetchSupportQuery,
  fetchSupportResponses,
  submitResponse,
  updateSupportQueryStatus,
} from "../../../../services/support/support";
import { useSession } from "../../../../context/SessionContext";

// Interface for SupportDetailState to define the shape of the state
interface SupportDetailState {
  query: any | null;
  responses: any[];
  loading: boolean;
  error: string | null;
  newMessage: string;
}

// Custom hook to manage support query details and responses
const useSupportDetail = () => {
  const { session, withTokenRefresh } = useSession();
  const router = useRouter();
  const { supportId } = router.query;
  const [state, setState] = useState<SupportDetailState>({
    query: null,
    responses: [],
    loading: true,
    error: null,
    newMessage: "",
  });
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    // Load support query and responses
    const loadQueryAndResponses = async () => {
      if (session?.accessToken && supportId && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          const [queryData, responsesData] = await Promise.all([
            withTokenRefresh((token) =>
              fetchSupportQuery(supportId as string, token)
            ),
            withTokenRefresh((token) => fetchSupportResponses(token)),
          ]);
          setState((prevState) => ({
            ...prevState,
            query: queryData,
            responses: responsesData.filter(
              (response: any) =>
                response.support_query_id === parseInt(supportId as string)
            ),
            loading: false,
            error: null,
          }));
        } catch (err) {
          console.error("Error fetching support query or responses:", err);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error:
              "Failed to fetch support query or responses. Please try again.",
          }));
        }
      }
    };
    loadQueryAndResponses();
  }, [session, supportId, withTokenRefresh]);

  // Handle new message input change
  const handleNewMessageChange = (value: string) => {
    setState((prevState) => ({ ...prevState, newMessage: value }));
  };

  // Submit a new message
  const handleNewMessageSubmit = async () => {
    if (state.query && session?.accessToken) {
      try {
        const response = {
          support_query_id: state.query.id,
          message: state.newMessage,
        };
        await withTokenRefresh((token) => submitResponse(response, token));
        setState((prevState) => ({ ...prevState, newMessage: "" }));
        // Reload responses
        const responsesData = await withTokenRefresh((token) =>
          fetchSupportResponses(token)
        );
        setState((prevState) => ({
          ...prevState,
          responses: responsesData.filter(
            (response: any) => response.support_query_id === state.query!.id
          ),
        }));
      } catch (err) {
        console.error("Error submitting new message:", err);
        setState((prevState) => ({
          ...prevState,
          error: "Failed to submit new message. Please try again.",
        }));
      }
    }
  };

  // Update the status of the support query
  const handleStatusChange = async (status: string) => {
    if (state.query && session?.accessToken) {
      try {
        await withTokenRefresh((token) =>
          updateSupportQueryStatus(state.query.id, { status }, token)
        );
        const updatedQuery = await withTokenRefresh((token) =>
          fetchSupportQuery(state.query.id, token)
        );
        setState((prevState) => ({
          ...prevState,
          query: updatedQuery,
        }));
      } catch (err) {
        console.error("Error updating query status:", err);
        setState((prevState) => ({
          ...prevState,
          error: "Failed to update query status. Please try again.",
        }));
      }
    }
  };

  // Combine query and response messages for display
  const combinedMessages = [
    ...state.responses.map((response) => ({ ...response, type: "response" })),
    state.query && {
      ...state.query,
      type: "query",
      message: state.query.question,
    },
  ]
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
    );

  return {
    state,
    handleNewMessageChange,
    handleNewMessageSubmit,
    handleStatusChange,
    combinedMessages,
  };
};

export default useSupportDetail;
