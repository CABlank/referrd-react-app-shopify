import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SupportIndex from "../SupportIndex";
import SupportDetail from "../SupportDetail";
import useSupport from "../hooks/useSupport";
import useSupportDetail from "../hooks/useSupportDetail";
import QueryForm from "../components/QueryForm";
import QueryList from "../components/QueryList";
import SupportMessageList from "../components/SupportMessageList";
import LoadingOverlay from "../../../../components/common/LoadingOverlay";
import { useRouter } from "next/router";

// Mock hooks and components
jest.mock("../hooks/useSupport");
jest.mock("../hooks/useSupportDetail");
jest.mock("../components/QueryForm");
jest.mock("../components/QueryList");
jest.mock("../components/SupportMessageList");
jest.mock("../../../../components/common/LoadingOverlay");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SupportIndex Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders QueryForm with the correct props", () => {
    const mockUseSupport = useSupport as jest.MockedFunction<typeof useSupport>;
    const mockHandleChange = jest.fn();
    const mockHandleSubmit = jest.fn();

    mockUseSupport.mockReturnValue({
      state: {
        queries: [],
        query: null,
        responses: [],
        loading: false,
        error: null,
        newMessage: "",
        queryTitle: "Test Query Title",
        question: "Test Question",
        topic: "Payment",
      },
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      handleQuerySelect: jest.fn(),
      handleNewMessageSubmit: jest.fn(),
      handleStatusChange: async (status: string) => {
        // Your code logic here
      },
    });

    render(<SupportIndex />);

    expect(QueryForm).toHaveBeenCalledWith(
      {
        queryTitle: "Test Query Title",
        question: "Test Question",
        topic: "Payment",
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      },
      {}
    );
  });
});

describe("SupportDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the router query parameters for the tests
    (useRouter as jest.Mock).mockReturnValue({
      query: {
        shop: "example.myshopify.com",
        host: "some-host-value",
        id_token: "some-id-token",
      },
    });
  });

  it("renders the SupportDetail component without crashing", () => {
    const mockUseSupportDetail = useSupportDetail as jest.MockedFunction<
      typeof useSupportDetail
    >;
    mockUseSupportDetail.mockReturnValue({
      state: {
        query: { id: 1, title: "Test Query", user_created: "User1" },
        responses: [],
        newMessage: "",
        loading: false,
        error: null,
      },
      handleNewMessageChange: jest.fn(),
      handleNewMessageSubmit: jest.fn(),
      handleStatusChange: jest.fn(),
      combinedMessages: [],
    });

    render(<SupportDetail />);

    expect(screen.getByText(/query: test query/i)).toBeInTheDocument();
  });

  it("displays the loading overlay when loading is true", () => {
    const mockUseSupportDetail = useSupportDetail as jest.MockedFunction<
      typeof useSupportDetail
    >;
    mockUseSupportDetail.mockReturnValue({
      state: {
        query: null,
        responses: [],
        newMessage: "",
        loading: true,
        error: null,
      },
      handleNewMessageChange: jest.fn(),
      handleNewMessageSubmit: jest.fn(),
      handleStatusChange: jest.fn(),
      combinedMessages: [],
    });

    render(<SupportDetail />);

    expect(LoadingOverlay).toHaveBeenCalled();
  });

  it("displays an error message if an error occurs", async () => {
    const mockUseSupportDetail = useSupportDetail as jest.MockedFunction<
      typeof useSupportDetail
    >;
    mockUseSupportDetail.mockReturnValue({
      state: {
        query: null,
        responses: [],
        newMessage: "",
        loading: false,
        error: "Failed to load support detail",
      },
      handleNewMessageChange: jest.fn(),
      handleNewMessageSubmit: jest.fn(),
      handleStatusChange: jest.fn(),
      combinedMessages: [],
    });

    render(<SupportDetail />);

    expect(
      screen.getByText(/failed to load support detail/i)
    ).toBeInTheDocument();
  });

  it("handles the new message submission correctly", async () => {
    const mockUseSupportDetail = useSupportDetail as jest.MockedFunction<
      typeof useSupportDetail
    >;
    const mockHandleNewMessageSubmit = jest.fn();

    mockUseSupportDetail.mockReturnValue({
      state: {
        query: { id: 1, title: "Test Query", user_created: "User1" },
        responses: [],
        newMessage: "Test message",
        loading: false,
        error: null,
      },
      handleNewMessageChange: jest.fn(),
      handleNewMessageSubmit: mockHandleNewMessageSubmit,
      handleStatusChange: jest.fn(),
      combinedMessages: [],
    });

    render(<SupportDetail />);

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockHandleNewMessageSubmit).toHaveBeenCalled();
    });
  });
});
