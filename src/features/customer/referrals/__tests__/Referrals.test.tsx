import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import ReferralsIndex from "../ReferralsIndex";
import ReferralDetails from "../ReferralDetails";
import useCustomers from "../hooks/useReferrals";
import useReferralDetails, { Customer } from "../hooks/useReferralDetails";

// Mock the hooks
jest.mock("../hooks/useReferrals");
jest.mock("../hooks/useReferralDetails");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockUseCustomers = useCustomers as jest.MockedFunction<
  typeof useCustomers
>;
const mockUseReferralDetails = useReferralDetails as jest.MockedFunction<
  typeof useReferralDetails
>;
const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Referrals Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useRouter
    mockRouter.mockReturnValue({
      query: {},
      push: jest.fn(),
    } as any);
  });

  describe("ReferralsIndex", () => {});

  describe("ReferralDetails", () => {
    it("should render without crashing", () => {
      mockUseReferralDetails.mockReturnValue({
        customer: null,
        campaign: null,
        conversions: [],
        shares: [],
        loading: false,
        error: null,
      });

      render(<ReferralDetails />);
      expect(screen.getByText("Referral Detail")).toBeInTheDocument();
    });

    it("should display loading overlay when loading", () => {
      mockUseReferralDetails.mockReturnValue({
        customer: null,
        campaign: null,
        conversions: [],
        shares: [],
        loading: true,
        error: null,
      });

      render(<ReferralDetails />);
      const statusElements = screen.getAllByRole("status");
      expect(statusElements[0]).toBeInTheDocument();
    });

    it("should display an error message if there is an error", () => {
      mockUseReferralDetails.mockReturnValue({
        customer: null,
        campaign: null,
        conversions: [],
        shares: [],
        loading: false,
        error: "Error fetching referral details.",
      });

      render(<ReferralDetails />);
      expect(
        screen.getByText(/Error fetching referral details./i)
      ).toBeInTheDocument();
    });

    it("should correctly display performance metrics", () => {
      mockUseReferralDetails.mockReturnValue({
        customer: {
          id: 1,
          date_created: "2023-08-28",
          uuid: "uuid1",
          name: "John Doe",
          email: "john@example.com",
          mobile: "123456789",
          referred_by: "ref1",
          conversion_count: 2,
          signup_count: 5,
          location: JSON.stringify({ city: "New York", country: "USA" }),
          click_count: 10,
          company_id: "comp1",
          campaign_uuid: "camp1",
        },
        campaign: { uuid: "camp1", id: 1, name: "Campaign 1" },
        conversions: [
          {
            id: 2,
            date_created: "2023-08-28",
            uuid: "uuid2",
            name: "Jane Doe",
            email: "jane@example.com",
            mobile: "987654321",
            referred_by: "uuid1",
            conversion_count: 1,
            signup_count: 1,
            location: JSON.stringify({ city: "Los Angeles", country: "USA" }),
            click_count: 3,
            company_id: "comp1",
            campaign_uuid: "camp2",
          },
        ],
        shares: [],
        loading: false,
        error: null,
      });

      render(<ReferralDetails />);

      expect(screen.getByText("Clicks")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      const conversionElements = screen.getAllByText("Conversions");
      expect(conversionElements[0]).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Sign ups")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });
});
