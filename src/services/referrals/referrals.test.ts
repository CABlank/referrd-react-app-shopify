import fetchMock from "jest-fetch-mock";
import {
  fetchReferrals,
  fetchCustomers,
  fetchCampaigns,
  fetchReferralCodes,
} from "./referrals"; // Adjust the import path as necessary

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api"; // Default value for testing

describe("API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const token = "test-token";

  const mockFetchFromAPI = (endpoint, data) => {
    fetchMock.mockResponseOnce(JSON.stringify({ data }));
  };

  const mockFetchFromAPIWithError = (endpoint) => {
    fetchMock.mockRejectOnce(new Error(`Failed to fetch ${endpoint}`));
  };

  describe("fetchReferrals", () => {
    it("should fetch all referrals", async () => {
      const data = [
        {
          id: 1,
          date_created: "2024-07-04T20:26:27.715Z",
          referrer: 1,
          campaign: 1,
          spend: 100,
        },
      ];

      mockFetchFromAPI("/items/referrals", data);

      const response = await fetchReferrals(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/referrals`,
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
      mockFetchFromAPIWithError("/items/referrals");

      await expect(fetchReferrals(token)).rejects.toThrow(
        "Failed to fetch /items/referrals"
      );
    });
  });

  describe("fetchCustomers", () => {
    it("should fetch all customers", async () => {
      const data = [{ id: 1, name: "Customer A" }];

      mockFetchFromAPI("/items/customers", data);

      const response = await fetchCustomers(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/customers`,
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
      mockFetchFromAPIWithError("/items/customers");

      await expect(fetchCustomers(token)).rejects.toThrow(
        "Failed to fetch /items/customers"
      );
    });
  });

  describe("fetchCampaigns", () => {
    it("should fetch all campaigns", async () => {
      const data = [{ id: 1, name: "Campaign A" }];

      mockFetchFromAPI("/items/campaigns", data);

      const response = await fetchCampaigns(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns`,
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
      mockFetchFromAPIWithError("/items/campaigns");

      await expect(fetchCampaigns(token)).rejects.toThrow(
        "Failed to fetch /items/campaigns"
      );
    });
  });

  describe("fetchReferralCodes", () => {
    it("should fetch all referral codes", async () => {
      const data = [{ id: 1, code: "ABC123" }];

      mockFetchFromAPI("/items/referral_codes", data);

      const response = await fetchReferralCodes(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/referral_codes`,
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
      mockFetchFromAPIWithError("/items/referral_codes");

      await expect(fetchReferralCodes(token)).rejects.toThrow(
        "Failed to fetch /items/referral_codes"
      );
    });
  });
});
