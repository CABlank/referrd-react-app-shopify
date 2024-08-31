import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyIndex from "../CompanyIndex";
import { useCompanyList } from "../hooks/useCompanyList";
import { useRouter } from "next/router";

// Mock the useRouter hook from next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Provide a mock implementation of useRouter
(useRouter as jest.Mock).mockReturnValue({
  route: "/",
  pathname: "/",
  query: {},
  asPath: "/",
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
});

// Mock the useCompanyList hook
jest.mock("../hooks/useCompanyList");

describe("CompanyIndex", () => {
  it("renders loading spinner while data is loading", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      companies: [],
      company: { name: "Test Company" },
      loading: true,
      error: null,
    });

    render(<CompanyIndex />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error message if there is an error", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      companies: [],
      company: { name: "Test Company" },
      loading: false,
      error: "Error loading companies",
    });

    render(<CompanyIndex />);

    // Use getAllByText to account for multiple error messages
    const errorMessages = screen.getAllByText("Error loading companies");
    expect(errorMessages.length).toBeGreaterThan(0); // Ensure at least one error message is rendered
  });

  it("renders FetchCompanyData if no companies are present", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      companies: [],
      company: { name: "Test Company" },
      loading: false,
      error: null,
    });

    render(<CompanyIndex />);
    expect(screen.getByText("Register Company Data")).toBeInTheDocument();
  });

  it("renders a list of company cards when companies are present", () => {
    const companies = [
      { id: "1", name: "Company A" },
      { id: "2", name: "Company B" },
    ];
    (useCompanyList as jest.Mock).mockReturnValue({
      companies,
      company: { name: "Test Company" },
      loading: false,
      error: null,
    });

    render(<CompanyIndex />);
    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Company B")).toBeInTheDocument();
  });
});
