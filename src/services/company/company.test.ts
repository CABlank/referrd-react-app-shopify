import fetchMock from "jest-fetch-mock";
import {
  fetchCompanies,
  fetchCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  uploadFile,
  fetchCompaniesWithLogo,
  Company,
} from "./company";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

describe("API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const token = "test-token";

  describe("fetchCompanies", () => {
    it("should fetch all companies", async () => {
      const data: Company[] = [
        {
          id: 1,
          name: "Company A",
          domain: "companya.com",
          logo: null,
          date_created: new Date("2024-07-04T20:26:27.715Z"),
        },
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      const response = await fetchCompanies(token);

      // Convert received date strings to Date objects
      const expectedResponse = data.map((company) => ({
        ...company,
        date_created: new Date(company.date_created as string),
      }));

      expect(response).toEqual(expectedResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/company`,
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
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/company"));

      await expect(fetchCompanies(token)).rejects.toThrow(
        "Failed to fetch /items/company"
      );
    });
  });

  describe("fetchCompany", () => {
    it("should fetch a specific company by ID", async () => {
      const id = 1;
      const data: Company = {
        id,
        name: "Company A",
        domain: "companya.com",
        logo: null,
        date_created: new Date("2024-07-04T20:26:27.751Z"),
      };

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      const response = await fetchCompany(id, token);

      // Convert received date string to Date object
      const expectedResponse = {
        ...data,
        date_created: new Date(data.date_created as string),
      };

      expect(response).toEqual(expectedResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/company/${id}`,
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
      fetchMock.mockRejectOnce(new Error("Failed to fetch /items/company/1"));

      await expect(fetchCompany(1, token)).rejects.toThrow(
        "Failed to fetch /items/company/1"
      );
    });
  });

  describe("createCompany", () => {
    it("should create a new company", async () => {
      const data: Company = {
        name: "Company A",
        domain: "companya.com",
        logo: null,
        date_created: new Date(),
      };

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      await createCompany(data, token);

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/company`,
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
      fetchMock.mockRejectOnce(new Error("Failed to create /items/company"));

      await expect(
        createCompany(
          { name: "", domain: "", logo: null, date_created: new Date() },
          token
        )
      ).rejects.toThrow("Failed to create /items/company");
    });
  });

  describe("updateCompany", () => {
    it("should update an existing company", async () => {
      const data: Company = {
        id: 1,
        name: "Company A",
        domain: "companya.com",
        logo: null,
        date_created: new Date(),
      };

      fetchMock.mockResponseOnce(JSON.stringify({ data }));

      await updateCompany(data, token);

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/company/${data.id}`,
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
      fetchMock.mockRejectOnce(new Error("Failed to update /items/company/1"));

      await expect(
        updateCompany(
          { id: 1, name: "", domain: "", logo: null, date_created: new Date() },
          token
        )
      ).rejects.toThrow("Failed to update /items/company/1");
    });
  });

  describe("deleteCompany", () => {
    it("should delete a company", async () => {
      const id = 1;

      fetchMock.mockResponseOnce(JSON.stringify({}));

      await deleteCompany(id, token);

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/company/${id}`,
        expect.objectContaining({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it("should throw an error if the request fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to delete /items/company/1"));

      await expect(deleteCompany(1, token)).rejects.toThrow(
        "Failed to delete /items/company/1"
      );
    });
  });

  describe("uploadFile", () => {
    it("should upload a file", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
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

    it("should throw an error if the request fails", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });

      fetchMock.mockRejectOnce(new Error("Failed to upload file"));

      await expect(uploadFile(file, token)).rejects.toThrow(
        "Failed to upload file"
      );
    });
  });

  describe("fetchCompaniesWithLogo", () => {
    it("should fetch companies with their logos", async () => {
      const companies: Company[] = [
        {
          id: 1,
          name: "Company A",
          domain: "companya.com",
          logo: "logo-id",
          date_created: new Date("2024-07-04T20:26:27.773Z"),
        },
      ];
      const logoData = { data: { filename_download: "logo.png" } };

      fetchMock
        .mockResponseOnce(JSON.stringify({ data: companies }))
        .mockResponseOnce(JSON.stringify(logoData));

      const response = await fetchCompaniesWithLogo(token);

      const expectedResponse = companies.map((company) => ({
        ...company,
        date_created: new Date(company.date_created as string),
        logoUrl: `${API_URL}/assets/${company.logo}/${logoData.data.filename_download}?access_token=${token}`,
      }));

      expect(response).toEqual(expectedResponse);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/items/company`,
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/files/logo-id`,
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it("should handle errors when fetching logos", async () => {
      const companies: Company[] = [
        {
          id: 1,
          name: "Company A",
          domain: "companya.com",
          logo: "logo-id",
          date_created: new Date("2024-07-04T20:26:27.776Z"),
        },
      ];

      fetchMock
        .mockResponseOnce(JSON.stringify({ data: companies }))
        .mockRejectOnce(new Error("Failed to fetch logo"));

      const response = await fetchCompaniesWithLogo(token);

      const expectedResponse = companies.map((company) => ({
        ...company,
        date_created: new Date(company.date_created as string),
        logoUrl: undefined,
      }));

      expect(response).toEqual(expectedResponse);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
