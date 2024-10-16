import { renderHook, act } from "@testing-library/react-hooks";
import { useRouter } from "next/router";
import { useEditCompany } from "../../hooks/useEditCompany";
import {
  createCompany,
  updateCompany,
  fetchCompany,
  uploadFile,
} from "../../../../../services/company/company";
import { useSession } from "../../../../../context/SessionContext";

// Mock necessary modules
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("../../../../../services/company/company", () => ({
  createCompany: jest.fn(),
  updateCompany: jest.fn(),
  fetchCompany: jest.fn(),
  uploadFile: jest.fn(),
}));
jest.mock("../../../../../context/SessionContext", () => ({
  useSession: jest.fn(),
}));

describe("useEditCompany", () => {
  const mockPush = jest.fn();
  const mockSession = { token: "fake-token" };
  const mockWithTokenRefresh = jest.fn((fn) => fn("fake-token"));

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: { companyId: "1" },
      push: mockPush,
    });
    (useSession as jest.Mock).mockReturnValue({
      session: mockSession,
      withTokenRefresh: mockWithTokenRefresh,
    });
  });

  it("should load company details on mount", async () => {
    const mockCompany = {
      name: "Test Company",
      domain: "test.com",
      logo: "logo-id",
      date_created: "2021-01-01",
      UUID: "1234",
      logoUrl: "http://logo.url",
    };

    (fetchCompany as jest.Mock).mockResolvedValue(mockCompany);

    const { result, waitForNextUpdate } = renderHook(() => useEditCompany());

    await waitForNextUpdate();

    expect(fetchCompany).toHaveBeenCalledWith(1, "fake-token");
    expect(result.current.company).toEqual(mockCompany);
    expect(result.current.logoPreview).toBe("http://logo.url");
    expect(result.current.error).toBeNull();
  });

  it("should handle change in company details", () => {
    const { result } = renderHook(() => useEditCompany());

    act(() => {
      result.current.handleChange("name", "Updated Company Name");
    });

    expect(result.current.company.name).toBe("Updated Company Name");
  });

  it("should update logo preview and company logo on file change", () => {
    const mockFile = new File(["logo"], "logo.png", { type: "image/png" });
    const mockUrl = "blob:http://localhost/logo-url";

    global.URL.createObjectURL = jest.fn(() => mockUrl);

    const { result } = renderHook(() => useEditCompany());

    const event = {
      target: { files: [mockFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(result.current.logoPreview).toBe(mockUrl);
    expect(result.current.company.logo).toBe(mockFile);
    expect(result.current.logoError).toBeNull();
  });

  it("should handle submit correctly", async () => {
    (uploadFile as jest.Mock).mockResolvedValue("uploaded-logo-id");
    (createCompany as jest.Mock).mockResolvedValue({});
    (updateCompany as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useEditCompany());

    act(() => {
      result.current.handleChange("name", "New Company");
      result.current.handleChange("logo", "existing-logo-id");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(uploadFile).not.toHaveBeenCalled();
    expect(updateCompany).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Company",
        logo: "existing-logo-id",
      }),
      "fake-token"
    );
    expect(mockPush).toHaveBeenCalledWith("/brand/company");
  });

  it("should handle errors during company submission", async () => {
    (uploadFile as jest.Mock).mockRejectedValue(new Error("Upload failed"));
    (createCompany as jest.Mock).mockRejectedValue(
      new Error("Creation failed")
    );

    const { result } = renderHook(() => useEditCompany());

    act(() => {
      result.current.handleChange("name", "New Company");
      result.current.handleChange(
        "logo",
        new File(["logo"], "logo.png", { type: "image/png" })
      );
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe(
      "Failed to save company. Please try again."
    );
    expect(result.current.loading).toBe(false);
  });

  it("should require a logo before submitting", async () => {
    const { result } = renderHook(() => useEditCompany());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.logoError).toBe("Logo is required.");
    expect(result.current.loading).toBe(false);
  });
});
