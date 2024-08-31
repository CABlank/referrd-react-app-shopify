import { render, screen, fireEvent } from "@testing-library/react";
import FetchCompanyData from "../../components/FetchCompanyData";
import { useCompanyList } from "../../hooks/useCompanyList";

// Mock the useCompanyList hook
jest.mock("../../hooks/useCompanyList");

describe("FetchCompanyData", () => {
  const mockUseCompanyList = {
    company: { name: "Test Company", logo: null },
    logoPreview: null,
    loading: false,
    error: null,
    logoError: null,
    isEditingName: false,
    isEditingLogo: false,
    handleChange: jest.fn(),
    handleFileChange: jest.fn(),
    handleSave: jest.fn(),
    handleFetchData: jest.fn(),
    handleEditName: jest.fn(),
    handleEditLogo: jest.fn(),
  };

  beforeEach(() => {
    (useCompanyList as jest.Mock).mockReturnValue(mockUseCompanyList);
  });

  it("renders the component correctly", () => {
    render(<FetchCompanyData />);

    expect(screen.getByText("Register Company Data")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Business Website")).toBeInTheDocument();
    expect(screen.getByText("Fetch Data")).toBeInTheDocument();
  });

  it("calls handleFetchData with the correct URL", () => {
    render(<FetchCompanyData />);

    const input = screen.getByPlaceholderText("Business Website");
    const fetchButton = screen.getByText("Fetch Data");

    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.click(fetchButton);

    expect(mockUseCompanyList.handleFetchData).toHaveBeenCalledWith(
      "example.com"
    );
  });

  it("renders fetched company data when available", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      ...mockUseCompanyList,
      company: { name: "Fetched Company", logo: null },
    });

    render(<FetchCompanyData />);

    expect(screen.getByText("Fetched Data:")).toBeInTheDocument();
    expect(screen.getByText("Fetched Company")).toBeInTheDocument();
  });

  it("handles editing the company name", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      ...mockUseCompanyList,
      isEditingName: true,
    });

    render(<FetchCompanyData />);

    const input = screen.getByDisplayValue("Test Company");

    fireEvent.change(input, { target: { value: "Updated Company Name" } });

    expect(mockUseCompanyList.handleChange).toHaveBeenCalledWith(
      "name",
      "Updated Company Name"
    );
  });

  it("handles editing the company logo", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      ...mockUseCompanyList,
      isEditingLogo: true,
      logoPreview: "http://logo-preview.url",
    });

    render(<FetchCompanyData />);

    // Select the file input using the test ID
    const fileInput = screen.getByTestId("company-logo-input");

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check that the handleFileChange function was called
    expect(mockUseCompanyList.handleFileChange).toHaveBeenCalled();
    // Check that the logo preview is correctly displayed
    expect(screen.getByAltText("Company Logo")).toHaveAttribute(
      "src",
      "http://logo-preview.url"
    );
  });

  it("displays an error message when fetching data fails", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      ...mockUseCompanyList,
      error: "Failed to fetch data",
    });

    render(<FetchCompanyData />);

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });

  it("displays a logo error when saving without a logo", () => {
    (useCompanyList as jest.Mock).mockReturnValue({
      ...mockUseCompanyList,
      logoError: "Logo is required",
    });

    render(<FetchCompanyData />);

    expect(screen.getByText("Logo is required")).toBeInTheDocument();
  });
});
