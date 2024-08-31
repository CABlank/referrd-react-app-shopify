import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsIndex from "../SettingsIndex";
import useSettings from "../hooks/useSettings";
import SettingsForm from "../components/SettingsForm";
import LoadingOverlay from "../../../../components/common/LoadingOverlay";

// Mock hooks and components
jest.mock("../hooks/useSettings");
jest.mock("../components/SettingsForm");
jest.mock("../../../../components/common/LoadingOverlay");

// Mocked functions
const mockUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockSettingsForm = SettingsForm as jest.MockedFunction<
  typeof SettingsForm
>;
const mockLoadingOverlay = LoadingOverlay as jest.MockedFunction<
  typeof LoadingOverlay
>;

describe("SettingsIndex Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays the loading overlay when loading is true", () => {
    mockUseSettings.mockReturnValue({
      settings: null,
      loading: true,
      error: null,
      handleChange: jest.fn(),
      handleSave: jest.fn(),
    });

    render(<SettingsIndex />);
    expect(mockLoadingOverlay).toHaveBeenCalled();
  });

  it("renders SettingsForm with the correct props", () => {
    const mockSettings = {
      id: 1,
      contactName: "John Doe",
      brandName: "Test Brand",
      mobile: "1234567890",
      email: "john@example.com",
      country: "USA",
      businessAddress: "123 Main St",
      notify_referral_conversions: true,
      notify_payment_confirmation: true,
      notify_payment_notifications: true,
      no_payment_notifications: false,
    };

    const mockHandleChange = jest.fn();
    const mockHandleSave = jest.fn();

    mockUseSettings.mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null,
      handleChange: mockHandleChange,
      handleSave: mockHandleSave,
    });

    render(<SettingsIndex />);
    expect(mockSettingsForm).toHaveBeenCalledWith(
      {
        settings: mockSettings,
        error: null,
        handleChange: mockHandleChange,
        handleSave: mockHandleSave,
      },
      {}
    );
  });
});
