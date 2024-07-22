import fetchMock from "jest-fetch-mock";
import {
  submitSupportQuery,
  updateSupportQueryStatus,
  fetchSupportQueries,
  fetchSupportQuery,
  fetchSupportResponses,
  submitResponse,
} from "./support"; // Adjust the import path as necessary

const API_URL = process.env.NEXT_PUBLIC_API_URL;

describe("API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const token = "test-token";

  describe("submitSupportQuery", () => {
    it("should submit a support query", async () => {
      const data = {
        title: "Test Title",
        question: "Test Question",
        topic: "Test Topic",
      };

      fetchMock.mockResponseOnce(JSON.stringify({ data: { id: 1, ...data } }));

      const response = await submitSupportQuery(data, token);

      expect(response).toEqual({ id: 1, ...data });
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/support_queries`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(
        new Error("Failed to submit /items/support_queries")
      );

      await expect(
        submitSupportQuery({ title: "", question: "", topic: "" }, token)
      ).rejects.toThrow("Failed to submit /items/support_queries");
    });
  });

  describe("updateSupportQueryStatus", () => {
    it("should update a support query status", async () => {
      const id = 1;
      const data = { status: "Resolved" };

      fetchMock.mockResponseOnce(JSON.stringify({ data: { id, ...data } }));

      const response = await updateSupportQueryStatus(id, data, token);

      expect(response).toEqual({ id, ...data });
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/support_queries/${id}`,
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(
        new Error("Failed to update /items/support_queries/1")
      );

      await expect(
        updateSupportQueryStatus(1, { status: "Resolved" }, token)
      ).rejects.toThrow("Failed to update /items/support_queries/1");
    });
  });

  describe("fetchSupportQueries", () => {
    it("should fetch all support queries", async () => {
      const data = [
        {
          id: 1,
          title: "Test Title",
          question: "Test Question",
          topic: "Test Topic",
        },
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      const response = await fetchSupportQueries(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/support_queries`,
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(
        new Error("Failed to fetch /items/support_queries")
      );

      await expect(fetchSupportQueries(token)).rejects.toThrow(
        "Failed to fetch /items/support_queries"
      );
    });
  });

  describe("fetchSupportQuery", () => {
    it("should fetch a specific support query by ID", async () => {
      const id = 1;
      const data = {
        id,
        title: "Test Title",
        question: "Test Question",
        topic: "Test Topic",
      };

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      const response = await fetchSupportQuery(id.toString(), token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/support_queries/${id}`,
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(
        new Error("Failed to fetch /items/support_queries/1")
      );

      await expect(fetchSupportQuery("1", token)).rejects.toThrow(
        "Failed to fetch /items/support_queries/1"
      );
    });
  });

  describe("fetchSupportResponses", () => {
    it("should fetch all support responses", async () => {
      const data = [{ id: 1, support_query_id: 1, message: "Test Response" }];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      const response = await fetchSupportResponses(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/support_responses`,
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(
        new Error("Failed to fetch /items/support_responses")
      );

      await expect(fetchSupportResponses(token)).rejects.toThrow(
        "Failed to fetch /items/support_responses"
      );
    });
  });

  describe("submitResponse", () => {
    it("should submit a support response", async () => {
      const data = { support_query_id: 1, message: "Test Response" };

      fetchMock.mockResponseOnce(JSON.stringify({ data: { id: 1, ...data } }));

      const response = await submitResponse(data, token);

      expect(response).toEqual({ id: 1, ...data });
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/support_responses`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(
        new Error("Failed to submit /items/support_responses")
      );

      await expect(
        submitResponse({ support_query_id: 1, message: "Test" }, token)
      ).rejects.toThrow("Failed to submit /items/support_responses");
    });
  });
});
