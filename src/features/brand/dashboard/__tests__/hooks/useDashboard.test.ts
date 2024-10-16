import { renderHook, act } from "@testing-library/react-hooks";
import { useDashboard } from "../../hooks/useDashboard";
import { useSession } from "../../../../../context/SessionContext";
import { fetchCompanyUUID } from "../../../../../services/payments/payments";
import { fetchDashboardData } from "../../../../../services/dashboard/dashboard";

jest.mock("../../../../../context/SessionContext");
jest.mock("../../../../../services/payments/payments");
jest.mock("../../../../../services/dashboard/dashboard");

describe("useDashboard", () => {
  const mockSession = { token: "fake-token" };
  const mockWithTokenRefresh = jest.fn((fn) => fn("fake-token"));

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      session: mockSession,
      withTokenRefresh: mockWithTokenRefresh,
      loading: false,
    });
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useDashboard());

    expect(result.current.dataLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.payments).toEqual([]);
    expect(result.current.customers).toEqual([]);
    expect(result.current.campaigns).toEqual([]);
  });

  it("should load data successfully", async () => {
    const mockUUID = "company-uuid";
    const mockData = {
      customers: [{ click_count: 10, conversion_count: 5 }],
      payments: [
        {
          total_price: "100.00",
          date_created: "2023-08-01",
          customer_email: "test@example.com",
          status: "completed",
          order_number: "123",
        },
      ],
      campaigns: [{ status: "live", date_updated: "2023-08-01" }],
    };

    (fetchCompanyUUID as jest.Mock).mockResolvedValue(mockUUID);
    (fetchDashboardData as jest.Mock).mockResolvedValue(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useDashboard());

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.dataLoading).toBe(false);
    expect(result.current.customers).toEqual(mockData.customers);
    expect(result.current.payments).toEqual(mockData.payments);
    expect(result.current.campaigns).toEqual(mockData.campaigns);
  });

  it("should handle errors during data loading", async () => {
    (fetchCompanyUUID as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const { result, waitForNextUpdate } = renderHook(() => useDashboard());

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.dataLoading).toBe(false);
    expect(result.current.error).toBe("Failed to load data. Please try again.");
  });

  it("should calculate performance metrics correctly", async () => {
    const mockUUID = "company-uuid";
    const mockData = {
      customers: [{ click_count: 10, conversion_count: 5 }],
      payments: [{ total_price: "100.00" }],
      campaigns: [],
    };

    (fetchCompanyUUID as jest.Mock).mockResolvedValue(mockUUID);
    (fetchDashboardData as jest.Mock).mockResolvedValue(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useDashboard());

    await act(async () => {
      await waitForNextUpdate();
    });

    const metrics = result.current.metrics;

    expect(metrics.totalClicks).toBe(10);
    expect(metrics.totalConversions).toBe(5);
    expect(metrics.totalSpend).toBe("100.00");
    expect(metrics.conversionRate).toBe("50.00");
  });

  it("should prioritize campaigns correctly", async () => {
    const mockUUID = "company-uuid";
    const mockData = {
      customers: [],
      payments: [],
      campaigns: [
        { status: "live", date_updated: "2023-08-01" },
        { status: "draft", date_updated: "2023-07-01" },
        { status: "live", date_updated: "2023-06-01" },
        { status: "paused", date_updated: "2023-05-01" },
      ],
    };

    (fetchCompanyUUID as jest.Mock).mockResolvedValue(mockUUID);
    (fetchDashboardData as jest.Mock).mockResolvedValue(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useDashboard());

    await act(async () => {
      await waitForNextUpdate();
    });

    const prioritizedCampaigns = result.current.prioritizedCampaigns;

    expect(prioritizedCampaigns.length).toBe(3);
    expect(prioritizedCampaigns[0].status).toBe("live");
    expect(prioritizedCampaigns[1].status).toBe("live");
    expect(prioritizedCampaigns[2].status).toBe("draft");
  });
});
