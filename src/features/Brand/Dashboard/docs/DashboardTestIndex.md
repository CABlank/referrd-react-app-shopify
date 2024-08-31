# DashboardIndex Component Test Design Document

## Overview

This document outlines the test strategies and implementations for the `DashboardIndex` component and its associated custom hook `useDashboard`. The tests are written using the `@testing-library/react` and `@testing-library/react-hooks` libraries to ensure that the components and hooks function correctly, handle errors gracefully, and manage states appropriately.

## File Location

- **Component Tests:** `src/features/brand/dashboard/__tests__/DashboardIndex.test.tsx`
- **Hook Tests:** `src/features/brand/dashboard/hooks/__tests__/useDashboard.test.tsx`

## Purpose

The purpose of these tests is to:

- Verify that the `DashboardIndex` component renders correctly with the expected UI elements.
- Ensure the `useDashboard` hook correctly handles data fetching, state management, and error handling.
- Confirm that performance metrics and campaign prioritization logic are accurate.

## Test Strategy

### 1. **Component Test: `DashboardIndex`**

The `DashboardIndex.test.tsx` file contains tests for the main dashboard component, focusing on the following areas:

- **Rendering:** Ensure that key elements, such as performance metrics, campaign information, and payment details, are rendered correctly.
- **Loading State:** Verify that the loading overlay is displayed when the data or session is still loading.
- **Error Handling:** Confirm that the component gracefully handles and displays errors when data fetching fails.

### 2. **Hook Test: `useDashboard`**

The `useDashboard.test.tsx` file contains tests for the custom hook, focusing on the following areas:

- **Initial State:** Ensure the hook initializes with the correct default state.
- **Data Fetching:** Verify that the hook successfully fetches and updates state with customer, payment, and campaign data.
- **Error Handling:** Confirm that the hook handles errors appropriately when data fetching fails.
- **Performance Metrics:** Ensure that the hook correctly calculates and returns performance metrics.
- **Campaign Prioritization:** Verify that the hook prioritizes campaigns according to their status and update dates.

## Key Mocked Dependencies

### 1. **Mocking `useDashboard`:**

In `DashboardIndex.test.tsx`, the `useDashboard` hook is mocked to return predefined data, allowing the tests to focus on UI rendering and state management without depending on actual data fetching.

- **Mock Data:** Includes metrics, campaigns, conversions, and customer data to simulate various states.

### 2. **Mocking `useSession`, `fetchCompanyUUID`, and `fetchDashboardData`:**

In `useDashboard.test.tsx`, the `useSession` context, `fetchCompanyUUID`, and `fetchDashboardData` services are mocked to control the flow of data and error handling during tests.

- **Session Mock:** Provides a fake token and token refresh function.
- **Data Fetching Mocks:** Return mock UUIDs and dashboard data, or simulate errors during the data fetching process.

## Test Cases

### 1. **DashboardIndex Component Tests:**

- **Renders Correctly:** Tests that the component renders performance metrics, campaign data, and payment details.
- **Displays Loading Overlay:** Tests that the loading overlay appears when `dataLoading` or `sessionLoading` is true.
- **Error Handling:** Tests that the component displays an error message when data fetching fails.

### 2. **useDashboard Hook Tests:**

- **Initial State:** Tests that the hook initializes with empty arrays and a `dataLoading` state of `true`.
- **Successful Data Load:** Tests that the hook correctly fetches and updates state with customer, payment, and campaign data.
- **Error Handling:** Tests that the hook sets an error state when data fetching fails.
- **Performance Metrics Calculation:** Tests that the hook calculates `totalClicks`, `totalConversions`, `totalSpend`, and `conversionRate` correctly.
- **Campaign Prioritization:** Tests that the hook correctly prioritizes live campaigns and orders other campaigns by their update date.

## Conclusion

These tests ensure that the `DashboardIndex` component and `useDashboard` hook function as expected, providing a reliable and user-friendly experience on the brand's dashboard. By covering rendering, state management, data fetching, error handling, and specific logic like metrics calculation and campaign prioritization, the tests contribute to the overall robustness and maintainability of the dashboard feature.
