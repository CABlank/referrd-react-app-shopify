import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardIndex from "../DashboardIndex";
import { useDashboard } from "../hooks/useDashboard";
import {
  mockMetrics,
  mockCampaigns,
  mockCustomers,
  mockConversions,
  mockConversionColumns,
} from "./mocks";

// Mock the useDashboard hook
jest.mock("../hooks/useDashboard");

describe("DashboardIndex", () => {
  const mockUseDashboard = {
    dataLoading: false,
    error: null,
    sessionLoading: false,
    metrics: mockMetrics,
    prioritizedCampaigns: mockCampaigns,
    latestConversions: mockConversions,
    latestConversionColumns: mockConversionColumns,
    customers: mockCustomers,
  };

  beforeEach(() => {
    (useDashboard as jest.Mock).mockReturnValue(mockUseDashboard);
  });

  it("renders the component correctly", () => {
    render(<DashboardIndex />);

    // Check for the presence of key elements
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    expect(
      screen.getByText(mockMetrics.totalClicks.toString())
    ).toBeInTheDocument();
    expect(screen.getByText("Campaigns")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
  });

  it("displays the loading overlay when data is loading", () => {
    (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      dataLoading: true,
    });

    render(<DashboardIndex />);

    // Adjusting to find the SVG icon or the loading overlay by role or class
    const loadingElements = screen.getAllByRole("status"); // Use getAllByRole to handle multiple elements
    expect(loadingElements.length).toBeGreaterThan(0); // Ensure at least one loading element is found
  });
});
