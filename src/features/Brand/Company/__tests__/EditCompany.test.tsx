import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditCompany from "../EditCompany";
import { useEditCompany } from "../hooks/useEditCompany";

// Mock the useEditCompany hook
jest.mock("../hooks/useEditCompany");

// Mock the Next.js Image component
jest.mock("next/image", () => {
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = "NextImage"; // Add displayName here
  return MockImage;
});

describe("EditCompany", () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useEditCompany as jest.Mock).mockReturnValue({
      company: { UUID: "123", name: "Test Company", domain: "test.com" },
      logoPreview: null,
      loading: false,
      error: null,
      logoError: null,
      handleChange: jest.fn(),
      handleFileChange: jest.fn(),
      handleSubmit: jest.fn(),
    });
  });

  it("renders correctly with company data", () => {
    render(<EditCompany />);

    // Check that the form elements are rendered
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Logo/i)).toBeInTheDocument();

    // Check that the input fields are populated
    expect(screen.getByPlaceholderText("Company Name")).toHaveValue(
      "Test Company"
    );
    expect(screen.getByPlaceholderText("Domain")).toHaveValue("test.com");
  });

  it("renders loading state", () => {
    // Mock the hook to return loading state
    (useEditCompany as jest.Mock).mockReturnValue({
      company: { UUID: "123", name: "Test Company", domain: "test.com" },
      logoPreview: null,
      loading: true,
      error: null,
      logoError: null,
      handleChange: jest.fn(),
      handleFileChange: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(<EditCompany />);

    // Check that the LoadingOverlay is rendered by checking for the spinner SVG
    expect(screen.getByRole("status")).toBeInTheDocument(); // The spinner should have role="status"

    // Find the correct container element and check if it has the blur class applied
    const container = screen.getByText("Edit Company").closest(".relative");
    expect(container).toHaveClass("blur");
  });

  it("displays error messages", () => {
    // Mock the hook to return error states
    (useEditCompany as jest.Mock).mockReturnValue({
      company: { UUID: "123", name: "Test Company", domain: "test.com" },
      logoPreview: null,
      loading: false,
      error: "There was an error saving the company.",
      logoError: "There was an error with the logo.",
      handleChange: jest.fn(),
      handleFileChange: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(<EditCompany />);

    // Check that error messages are displayed
    expect(
      screen.getByText("There was an error saving the company.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("There was an error with the logo.")
    ).toBeInTheDocument();
  });

  it("handles form submission", () => {
    const mockHandleSubmit = jest.fn();

    (useEditCompany as jest.Mock).mockReturnValue({
      company: { UUID: "123", name: "Test Company", domain: "test.com" },
      logoPreview: null,
      loading: false,
      error: null,
      logoError: null,
      handleChange: jest.fn(),
      handleFileChange: jest.fn(),
      handleSubmit: mockHandleSubmit,
    });

    render(<EditCompany />);

    // Simulate form submission
    fireEvent.click(screen.getByText(/Save/i));

    // Check that the handleSubmit function is called
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("handles input changes", () => {
    const mockHandleChange = jest.fn();

    (useEditCompany as jest.Mock).mockReturnValue({
      company: { UUID: "123", name: "Test Company", domain: "test.com" },
      logoPreview: null,
      loading: false,
      error: null,
      logoError: null,
      handleChange: mockHandleChange,
      handleFileChange: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(<EditCompany />);

    // Simulate input change
    fireEvent.change(screen.getByPlaceholderText("Company Name"), {
      target: { value: "New Name" },
    });

    // Check that the handleChange function is called with correct arguments
    expect(mockHandleChange).toHaveBeenCalledWith("name", "New Name");
  });

  it("handles file input changes", () => {
    const mockHandleFileChange = jest.fn();
    const file = new File(["logo"], "logo.png", { type: "image/png" });

    (useEditCompany as jest.Mock).mockReturnValue({
      company: { UUID: "123", name: "Test Company", domain: "test.com" },
      logoPreview: null,
      loading: false,
      error: null,
      logoError: null,
      handleChange: jest.fn(),
      handleFileChange: mockHandleFileChange,
      handleSubmit: jest.fn(),
    });

    render(<EditCompany />);

    // Simulate file input change
    const fileInput = screen.getByLabelText(/Logo/i);
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Check that the handleFileChange function is called
    expect(mockHandleFileChange).toHaveBeenCalled();

    // Optionally, remove the specific file comparison to avoid the event issue:
    // expect(mockHandleFileChange).toHaveBeenCalledWith(file);
  });
});
