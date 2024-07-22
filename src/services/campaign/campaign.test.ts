import fetchMock from "jest-fetch-mock";
import {
  fetchCampaigns,
  fetchCampaign,
  createCampaign,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign,
  uploadFile,
  Campaign,
} from "./campaign";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

describe("Campaign API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const token = "test-token";
  const campaign: Campaign = {
    settingsState: "state",
    commission: "10%",
    commissionType: "Percentage",
    name: "Test Campaign",
    url: "https://example.com",
    startDate: "2024-01-01",
    closeDate: "2024-12-31",
    company: "Test Company",
    terms: "Terms and conditions",
    discountType: "Percentage",
    discountValue: "10",
    appliesTo: "All items",
    format: "Popup",
    logo: new File(["content"], "logo.png", { type: "image/png" }),
  };

  describe("fetchCampaigns", () => {
    it("should fetch all campaigns", async () => {
      const campaigns = [campaign];
      fetchMock.mockResponseOnce(JSON.stringify({ data: campaigns }));

      const response = await fetchCampaigns(token);

      expect(response).toEqual(campaigns);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns`,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` },
        })
      );
    });

    it("should throw an error if fetching campaigns fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/campaigns"));

      await expect(fetchCampaigns(token)).rejects.toThrow(
        "Failed to fetch /items/campaigns"
      );
    });
  });

  describe("fetchCampaign", () => {
    it("should fetch a specific campaign by ID", async () => {
      const campaignId = 1;
      fetchMock.mockResponseOnce(JSON.stringify({ data: campaign }));

      const response = await fetchCampaign(campaignId, token);

      expect(response).toEqual(campaign);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns/${campaignId}`,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` },
        })
      );
    });

    it("should throw an error if fetching a campaign fails", async () => {
      const campaignId = 1;
      fetchMock.mockRejectOnce(
        new Error(`Failed to fetch /items/campaigns/${campaignId}`)
      );

      await expect(fetchCampaign(campaignId, token)).rejects.toThrow(
        `Failed to fetch /items/campaigns/${campaignId}`
      );
    });
  });

  describe("createCampaign", () => {
    it("should create a new campaign", async () => {
      const createdCampaign = { ...campaign, id: 1 };
      fetchMock.mockResponseOnce(JSON.stringify({ data: createdCampaign }));

      const response = await createCampaign(campaign, token);

      expect(response).toEqual(createdCampaign);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(campaign),
        })
      );
    });

    it("should throw an error if creating a campaign fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/campaigns"));

      await expect(createCampaign(campaign, token)).rejects.toThrow(
        "Failed to fetch /items/campaigns"
      );
    });
  });

  describe("updateCampaign", () => {
    it("should update an existing campaign", async () => {
      const updatedCampaign = { ...campaign, id: 1 };
      fetchMock.mockResponseOnce(JSON.stringify({ data: updatedCampaign }));

      await expect(updateCampaign(updatedCampaign, token)).resolves.toEqual(
        undefined
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns/${updatedCampaign.id}`,
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCampaign),
        })
      );
    });

    it("should throw an error if updating a campaign fails", async () => {
      const updatedCampaign = { ...campaign, id: 1 };
      fetchMock.mockRejectOnce(
        new Error(`Failed to fetch /items/campaigns/${updatedCampaign.id}`)
      );

      await expect(updateCampaign(updatedCampaign, token)).rejects.toThrow(
        `Failed to fetch /items/campaigns/${updatedCampaign.id}`
      );
    });
  });

  describe("updateCampaignStatus", () => {
    it("should update the status of a campaign", async () => {
      const campaignId = 1;
      const status = "Active";
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await expect(
        updateCampaignStatus(campaignId, status, token)
      ).resolves.toEqual(undefined);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns/${campaignId}`,
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        })
      );
    });

    it("should throw an error if updating the status of a campaign fails", async () => {
      const campaignId = 1;
      const status = "Active";
      fetchMock.mockRejectOnce(
        new Error(`Failed to fetch /items/campaigns/${campaignId}`)
      );

      await expect(
        updateCampaignStatus(campaignId, status, token)
      ).rejects.toThrow(`Failed to fetch /items/campaigns/${campaignId}`);
    });
  });

  describe("deleteCampaign", () => {
    it("should delete a campaign", async () => {
      const campaignId = 1;
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await expect(deleteCampaign(campaignId, token)).resolves.toEqual(
        undefined
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/campaigns/${campaignId}`,
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it("should throw an error if deleting a campaign fails", async () => {
      const campaignId = 1;
      fetchMock.mockRejectOnce(
        new Error(`Failed to fetch /items/campaigns/${campaignId}`)
      );

      await expect(deleteCampaign(campaignId, token)).rejects.toThrow(
        `Failed to fetch /items/campaigns/${campaignId}`
      );
    });
  });

  describe("uploadFile", () => {
    it("should upload a file", async () => {
      const file = new File(["content"], "file.png", { type: "image/png" });
      const fileId = "file-id";
      fetchMock.mockResponseOnce(JSON.stringify({ data: { id: fileId } }));

      const response = await uploadFile(file, token);

      expect(response).toEqual(fileId);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/files`,
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: expect.any(FormData),
        })
      );
    });

    it("should throw an error if file upload fails", async () => {
      const file = new File(["content"], "file.png", { type: "image/png" });
      fetchMock.mockRejectOnce(new Error("Failed to upload file"));

      await expect(uploadFile(file, token)).rejects.toThrow(
        "Failed to upload file"
      );
    });
  });
});
