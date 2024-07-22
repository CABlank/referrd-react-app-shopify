const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfaces for SupportQuery and Response data structures
interface SupportQuery {
  id?: number;
  title: string;
  question: string;
  topic: string;
  status?: string;
}

interface Response {
  id?: number;
  support_query_id: number;
  message: string;
}

// Helper function to make API requests
const fetchFromAPI = async (
  endpoint: string,
  method: string,
  token: string,
  data?: any
) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(
      `Failed to ${
        method === "GET" ? "fetch" : method === "POST" ? "submit" : "update"
      } ${endpoint}`
    );
  }

  const result = await response.json();
  return result.data;
};

// Submit a new support query
export const submitSupportQuery = (data: SupportQuery, token: string) =>
  fetchFromAPI("/items/support_queries", "POST", token, data);

// Update the status of an existing support query
export const updateSupportQueryStatus = (
  id: number,
  data: Partial<SupportQuery>,
  token: string
) => fetchFromAPI(`/items/support_queries/${id}`, "PATCH", token, data);

// Fetch all support queries
export const fetchSupportQueries = (token: string) =>
  fetchFromAPI("/items/support_queries", "GET", token);

// Fetch a specific support query by ID
export const fetchSupportQuery = (id: string, token: string) =>
  fetchFromAPI(`/items/support_queries/${id}`, "GET", token);

// Fetch all support responses
export const fetchSupportResponses = (token: string) =>
  fetchFromAPI("/items/support_responses", "GET", token);

// Submit a new support response
export const submitResponse = (data: Response, token: string) =>
  fetchFromAPI("/items/support_responses", "POST", token, data);
