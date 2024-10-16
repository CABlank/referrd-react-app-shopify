import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentIndex from "../PaymentIndex";
import { usePayments } from "../hooks/usePayments";

jest.mock("../hooks/usePayments");
const mockUsePayments = usePayments as jest.MockedFunction<typeof usePayments>;

describe("PaymentIndex", () => {
  beforeEach(() => {
    mockUsePayments.mockReturnValue({
      payments: [
        {
          id: 1,
          referral_uuid: "ref1",
          campaign_uuid: "camp1",
          total_price: "100.00",
          date_created: "2023-08-28",
          order_number: "12345",
          referrer: "John Doe",
          campaign: "Campaign 1",
          referralCashback: 10,
          date: "2023-08-28",
          order: "Order 1",
          status: "Pending",
        },
        {
          id: 2,
          referral_uuid: "ref2",
          campaign_uuid: "camp2",
          total_price: "200.00",
          date_created: "2023-08-27",
          order_number: "12346",
          referrer: "Jane Doe",
          campaign: "Campaign 2",
          referralCashback: 20,
          date: "2023-08-27",
          order: "Order 2",
          status: "Accepted",
        },
      ],
      loading: false,
      error: null,
      handlePaymentAction: jest.fn(),
      handleBulkAction: jest.fn(),
      selectedPayments: [],
      setSelectedPayments: jest.fn(),
      selectAll: false,
      setSelectAll: jest.fn(),
    });
  });

  it("should render without crashing", () => {
    render(
      <PaymentIndex
        accessToken="token"
        refreshToken="refreshToken"
        userId={1}
      />
    );
    expect(screen.getByText("Accepted Payments")).toBeInTheDocument();
    expect(screen.getByText("Declined Payments")).toBeInTheDocument();
    expect(screen.getByText("Pending Payments")).toBeInTheDocument();
  });

  it("should filter payments based on search query", () => {
    render(
      <PaymentIndex
        accessToken="token"
        refreshToken="refreshToken"
        userId={1}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      "Search Referrals or Campaign"
    );
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
  });

  it("should display loading overlay when loading", () => {
    mockUsePayments.mockReturnValueOnce({
      ...mockUsePayments(),
      loading: true,
    });
    render(
      <PaymentIndex
        accessToken="token"
        refreshToken="refreshToken"
        userId={1}
      />
    );

    const loadingElements = screen.getAllByRole("status");
    expect(loadingElements[0]).toBeInTheDocument(); // Expect at least one loading indicator
  });
});
