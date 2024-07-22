import React from "react";
import { render, screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";
import { useSession } from "../../contexts/SessionContext";
import { createMockRouter } from "../../test-utils/createMockRouter";

// Mock the custom hooks
jest.mock("../../../src/hooks/useBodyStyle");
jest.mock("../../../src/hooks/useIsMobile");
jest.mock("../../../src/hooks/useRedirectOnSession");

// Mock the useSession hook
jest.mock("../../../src/contexts/SessionContext", () => ({
  useSession: jest.fn(),
}));

// Mock useRouter from next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("AuthLayout", () => {
  const mockUseSession = useSession as jest.Mock;
  const mockUseRouter = require("next/router").useRouter;

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      session: {
        user: {
          role: "Brand",
        },
      },
    });
    mockUseRouter.mockReturnValue(createMockRouter({}));
  });

  it("renders the logo, title, subtitle, and children correctly", () => {
    render(
      <AuthLayout title="Test Title" subtitle="Test Subtitle">
        <div>Test Children</div>
      </AuthLayout>
    );

    // Basic Jest assertions to check for presence of elements
    expect(screen.getByAltText("Logo")).not.toBeNull();
    expect(screen.getByText("Test Title")).not.toBeNull();
    expect(screen.getByText("Test Subtitle")).not.toBeNull();
    expect(screen.getByText("Test Children")).not.toBeNull();
  });
});
