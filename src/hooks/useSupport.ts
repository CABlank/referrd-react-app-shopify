import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  fetchSupportQueries,
  submitSupportQuery,
  fetchSupportQuery,
  fetchSupportResponses,
  submitResponse,
  updateSupportQueryStatus,
} from "../services/support/support";
// import { useSession } from "../contexts/SessionContext"; // No longer needed since we're using a hardcoded token

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
const useSupport = () => {
  // const { session, withTokenRefresh } = useSession(); // No longer needed since we're using a hardcoded token
  const router = useRouter(); // Add router here
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
      const hardcodedToken = "s3-ZWWXB2aPvx_nIShLlF2a12mafupCk";
      if (hardcodedToken && !loadExecutedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          const data = await fetchSupportQueries(hardcodedToken);
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
  }, []);

  // Handle input changes
  const handleChange = (field: keyof SupportState, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Submit a new support query
  const handleSubmit = async () => {
    const hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
    if (hardcodedToken) {
      try {
        const data = {
          title: state.queryTitle,
          question: state.question,
          topic: state.topic,
          status: "Pending",
        };
        await submitSupportQuery(data, hardcodedToken);
        setState((prevState) => ({
          ...prevState,
          queryTitle: "",
          question: "",
          topic: "Payment",
        }));
        // Reload queries to show the new submission
        const updatedQueries = await fetchSupportQueries(hardcodedToken);
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
    const hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
    if (state.query && hardcodedToken) {
      try {
        const response = {
          support_query_id: state.query.id,
          message: state.newMessage,
        };
        await submitResponse(response, hardcodedToken);
        setState((prevState) => ({ ...prevState, newMessage: "" }));
        // Reload responses
        const responsesData = await fetchSupportResponses(hardcodedToken);
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
    const hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
    if (state.query && hardcodedToken) {
      try {
        await updateSupportQueryStatus(
          state.query.id,
          { status },
          hardcodedToken
        );
        const updatedQuery = await fetchSupportQuery(
          state.query.id,
          hardcodedToken
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
    router.push(`/brand/support/${query.id}`); // Navigate to the support detail page
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
// };
