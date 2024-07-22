import fetchMock from "jest-fetch-mock";
import {
  fetchReferrals,
  fetchCustomers,
  fetchCampaigns,
  fetchReferralCodes,
  fetchPayments,
  updatePaymentStatus,
  Referral,
  Customer,
  Campaign,
  Payment,
} from "./payments"; // Adjust the import path as necessary

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api"; // Default value for testing

describe("API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const token = "test-token";

  describe("fetchReferrals", () => {
    it("should fetch all referrals", async () => {
      const data: Referral[] = [
        {
          id: 1,
          date_created: "2024-07-04T20:26:27.715Z",
          referrer: 1,
          campaign: 1,
          spend: 100,
        },
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

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
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/referrals"));

      await expect(fetchReferrals(token)).rejects.toThrow(
        "Failed to fetch /items/referrals"
      );
    });
  });

  describe("fetchCustomers", () => {
    it("should fetch all customers", async () => {
      const data: Customer[] = [{ id: 1, name: "Customer A" }];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

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
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/customers"));

      await expect(fetchCustomers(token)).rejects.toThrow(
        "Failed to fetch /items/customers"
      );
    });
  });

  describe("fetchCampaigns", () => {
    it("should fetch all campaigns", async () => {
      const data: Campaign[] = [{ id: 1, name: "Campaign A" }];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

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
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/campaigns"));

      await expect(fetchCampaigns(token)).rejects.toThrow(
        "Failed to fetch /items/campaigns"
      );
    });
  });

  describe("fetchReferralCodes", () => {
    it("should fetch all referral codes", async () => {
      const data: any[] = [{ id: 1, code: "ABC123" }];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

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
      fetchMock.mockRejectOnce(
        new Error("Failed to fetch /items/referral_codes")
      );

      await expect(fetchReferralCodes(token)).rejects.toThrow(
        "Failed to fetch /items/referral_codes"
      );
    });
  });

  describe("fetchPayments", () => {
    it("should fetch all payments", async () => {
      const data: Payment[] = [
        {
          id: 1,
          status: "Pending",
          referral_id: 1,
          date_created: "2024-07-04T20:26:27.715Z",
        },
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      const response = await fetchPayments(token);

      expect(response).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/payments`,
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
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/payments"));

      await expect(fetchPayments(token)).rejects.toThrow(
        "Failed to fetch /items/payments"
      );
    });
  });

  describe("updatePaymentStatus", () => {
    it("should update the payment status", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await updatePaymentStatus(1, "Accepted", token);

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/payments/1`,
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Accepted" }),
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to update /items/payments/1"));

      await expect(updatePaymentStatus(1, "Accepted", token)).rejects.toThrow(
        "Failed to update /items/payments/1"
      );
    });
  });
});
