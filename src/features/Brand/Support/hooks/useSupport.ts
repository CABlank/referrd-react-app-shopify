import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  fetchSupportQueries,
  submitSupportQuery,
  fetchSupportQuery,
  fetchSupportResponses,
  submitResponse,
  updateSupportQueryStatus,
} from "../../../../services/support/support";
import { useSession } from "../../../../context/SessionContext";

// Interface for SupportState to define the shape of the state
export interface SupportState {
  queries: any[];
  query: any | null;
  responses: any[];
  loading: boolean;
  error: string | null;
  newMessage: string;
  queryTitle: string;
  question: string;
  topic: string;
}

// Custom hook to manage support queries and responses
const useSupport = ({
  accessToken,
  refreshToken,
  userId,
}: {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}) => {
  const { session, withTokenRefresh } = useSession();
  const router = useRouter();
  const [state, setState] = useState<SupportState>({
    queries: [],
    query: null,
    responses: [],
    loading: true,
    error: null,
    newMessage: "",
    queryTitle: "",
    question: "",
    topic: "Payment",
  });
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadQueries = async () => {
      if ((session?.accessToken || accessToken) && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          const data = await withTokenRefresh(
            (token) => fetchSupportQueries(token),
            refreshToken,
            userId
          );
          setState((prevState) => ({
            ...prevState,
            queries: data,
            loading: false,
            error: null,
          }));
        } catch (err) {
          console.error("Error fetching support queries:", err);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: "Failed to fetch support queries. Please try again.",
          }));
        }
      }
    };

    loadQueries();
  }, [session, accessToken, refreshToken, userId, withTokenRefresh]);

  // Handle input changes
  const handleChange = (field: keyof SupportState, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Submit a new support query
  const handleSubmit = async () => {
    if (session?.accessToken || accessToken) {
      try {
        const data = {
          title: state.queryTitle,
          question: state.question,
          topic: state.topic,
          status: "Pending",
        };
        await withTokenRefresh(
          (token) => submitSupportQuery(data, token),
          refreshToken,
          userId
        );
        setState((prevState) => ({
          ...prevState,
          queryTitle: "",
          question: "",
          topic: "Payment",
        }));
        // Reload queries to show the new submission
        const updatedQueries = await withTokenRefresh(
          (token) => fetchSupportQueries(token),
          refreshToken,
          userId
        );
        setState((prevState) => ({
          ...prevState,
          queries: updatedQueries,
        }));
      } catch (err) {
        console.error("Error submitting support query:", err);
        setState((prevState) => ({
          ...prevState,
          error: "Failed to submit support query. Please try again.",
        }));
      }
    }
  };

  // Submit a new message for a specific support query
  const handleNewMessageSubmit = async () => {
    if (state.query && (session?.accessToken || accessToken)) {
      try {
        const response = {
          support_query_id: state.query.id,
          message: state.newMessage,
        };
        await withTokenRefresh(
          (token) => submitResponse(response, token),
          refreshToken,
          userId
        );
        setState((prevState) => ({ ...prevState, newMessage: "" }));
        // Reload responses
        const responsesData = await withTokenRefresh(
          (token) => fetchSupportResponses(token),
          refreshToken,
          userId
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

  // Update the status of a specific support query
  const handleStatusChange = async (status: string) => {
    if (state.query && (session?.accessToken || accessToken)) {
      try {
        await withTokenRefresh(
          (token) =>
            updateSupportQueryStatus(state.query.id, { status }, token),
          refreshToken,
          userId
        );
        const updatedQuery = await withTokenRefresh(
          (token) => fetchSupportQuery(state.query.id, token),
          refreshToken,
          userId
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

  // Handle selecting a query
  const handleQuerySelect = (query: any) => {
    const { shop, host, id_token } = router.query; // Extract existing query parameters

    // Declare 'url' outside of the block
    let url = "";

    // Build the base URL depending on the user role
    if (router.pathname.includes("brand")) {
      url = `/brand/support/${query.id}`;
    } else {
      url = `/customer/support/${query.id}`;
    }

    // If the environment is a Shopify store, append the required query parameters
    if (shop || host || id_token) {
      const urlObj = new URL(window.location.origin + url);
      if (shop) urlObj.searchParams.set("shop", shop as string);
      if (host) urlObj.searchParams.set("host", host as string);
      if (id_token) urlObj.searchParams.set("id_token", id_token as string);

      // Assign the final URL back to 'url'
      url = urlObj.toString().replace(window.location.origin, "");
    }

    // Navigate to the support detail page with the updated URL
    router.push(url);
  };

  return {
    state,
    handleChange,
    handleSubmit,
    handleNewMessageSubmit,
    handleStatusChange,
    handleQuerySelect,
  };
};

export default useSupport;
