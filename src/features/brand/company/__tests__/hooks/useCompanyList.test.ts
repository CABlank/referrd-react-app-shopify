import { renderHook, act } from "@testing-library/react-hooks";
import { useCompanyList } from "../../hooks/useCompanyList";
import { fetchCompaniesWithLogo } from "../../../../../services/company/company";
import { useSession } from "../../../../../context/SessionContext";
import { useRouter } from "next/router";

// Mock the next/router module
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../../../../services/company/company");
jest.mock("../../../../../context/SessionContext");

describe("useCompanyList", () => {
  const mockSession = { token: "fake-token" };
  const mockWithTokenRefresh = jest.fn((fn) => fn("fake-token"));
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      session: mockSession,
      withTokenRefresh: mockWithTokenRefresh,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      query: {},
      pathname: "",
    });
  });

  it("should load companies on mount", async () => {
    const mockCompanies = [{ name: "Company A" }, { name: "Company B" }];
    (fetchCompaniesWithLogo as jest.Mock).mockResolvedValue(mockCompanies);

    const { result, waitForNextUpdate } = renderHook(() => useCompanyList());

    await waitForNextUpdate();

    expect(result.current.companies).toEqual(mockCompanies);
    expect(fetchCompaniesWithLogo).toHaveBeenCalled();
  });

  it("should handle errors when fetching companies", async () => {
    (fetchCompaniesWithLogo as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const { result, waitForNextUpdate } = renderHook(() => useCompanyList());

    await waitForNextUpdate();

    expect(result.current.error).toEqual(
      "Failed to fetch companies. Please try again."
    );
  });

  it("should allow company creation and handle saving errors", async () => {
    const mockCompany = { name: "New Company", domain: "newcompany.com" };
    (fetchCompaniesWithLogo as jest.Mock).mockResolvedValue([mockCompany]);

    const { result, waitForNextUpdate } = renderHook(() => useCompanyList());

    act(() => {
      result.current.handleSave();
    });

    await waitForNextUpdate();

    expect(fetchCompaniesWithLogo).toHaveBeenCalled();
  });
});
