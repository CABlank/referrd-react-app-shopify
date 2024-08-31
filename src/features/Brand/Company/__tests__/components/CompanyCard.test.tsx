// components/__tests__/CompanyCard.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CompanyCard from "../../components/CompanyCard";
import { useRouter } from "next/router";
import { Company } from "../../../../../services/company/company";

// Mock the next/router module
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("CompanyCard", () => {
  const mockPush = jest.fn();

  const mockCompany: Company = {
    id: 1,
    name: "Test Company",
    domain: "testcompany.com",
    logo: null, // Ensure this property is included
    logoUrl: "http://logo.url",
    date_created: "2022-01-01",
    UUID: "uuid-test-company",
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders company details correctly", () => {
    render(<CompanyCard company={mockCompany} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("testcompany.com")).toBeInTheDocument();
    expect(screen.getByText("Created on 1/1/2022")).toBeInTheDocument();

    const logo = screen.getByAltText("Company Logo");
    expect(logo).toBeInTheDocument();

    // Check for the URL-encoded version of "http://logo.url"
    expect(logo).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent("http://logo.url"))
    );
  });

  it("navigates to the edit page when the edit button is clicked", () => {
    render(<CompanyCard company={mockCompany} />);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/brand/company/edit?companyId=1");
  });

  it("renders fallback logo when logoUrl is not provided", () => {
    const companyWithoutLogo: Company = {
      ...mockCompany,
      logoUrl: undefined, // Set logoUrl to undefined
    };

    render(<CompanyCard company={companyWithoutLogo} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();

    const fallbackLogo = screen.getByTestId("fallback-logo");
    expect(fallbackLogo).toBeInTheDocument();
  });
});
