import fetchMock from "jest-fetch-mock";
import {
  fetchDashboardData,
  Payment,
  Customer,
  Campaign,
  Referral,
} from "./dashboard"; // Adjust the import path as necessary

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api"; // Default value for testing

describe("Dashboard API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const token = "test-token";

  describe("fetchDashboardData", () => {
    it("should fetch all dashboard data", async () => {
      const payments: Payment[] = [
        {
          id: 1,
          status: "completed",
          referral_id: 1,
          date_created: "2024-07-04T20:26:27.715Z",
        },
      ];
      const customers: Customer[] = [
        {
          id: 1,
          email: "customer@example.com",
          name: "Customer A",
          mobile: "1234567890",
          referralCode: 101,
        },
      ];
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: "Campaign A",
          date_updated: "2024-07-04T20:26:27.715Z",
          imageSrc: "image.png",
          test: "test",
          price: 100,
          openTo: "2024-08-01",
          closeDate: "2024-09-01",
          status: "active",
        },
      ];
      const referrals: Referral[] = [
        {
          id: 1,
          test: "test",
          referralCode: 101,
          date_created: "2024-07-04T20:26:27.715Z",
          referrer: 1,
          campaign: 1,
          spend: 100,
          conversion: "conversion",
          location: "location",
        },
      ];
      const referralCodes: any[] = [{ id: 1, code: "ABC123" }];

      fetchMock
        .mockResponseOnce(JSON.stringify({ data: payments }))
        .mockResponseOnce(JSON.stringify({ data: customers }))
        .mockResponseOnce(JSON.stringify({ data: campaigns }))
        .mockResponseOnce(JSON.stringify({ data: referrals }))
        .mockResponseOnce(JSON.stringify({ data: referralCodes }));

      const response = await fetchDashboardData(token);

      expect(response).toEqual({
        payments,
        customers,
        campaigns: campaigns.map((campaign) => ({
          ...campaign,
          date_updated: new Date(campaign.date_updated).toISOString(),
        })),
        referrals,
        referralCodes,
      });

      expect(fetchMock).toHaveBeenCalledTimes(5);
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

    it("should throw an error if any request fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/payments"));

      await expect(fetchDashboardData(token)).rejects.toThrow(
        "Failed to fetch /items/payments"
      );

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
  });
});
