# DashboardIndex Component Design Document

## Overview

The `DashboardIndex` component is a React functional component that serves as the main dashboard view for a brand. It provides an overview of key performance metrics, recent campaigns, referral details, and payment conversions. This component relies heavily on data fetched through a custom hook (`useDashboard`) and renders several UI components to present this data to the user.

## File Location

`src/features/Brand/Dashboard/DashboardIndex.tsx`

## Purpose

The purpose of the `DashboardIndex` component is to display the brand's dashboard, offering insights into performance metrics, recent campaigns, and payment details. This is achieved through a combination of data fetching, state management, and rendering a variety of UI components.

## Key Responsibilities

- **Data Fetching:** Uses the `useDashboard` hook to fetch data related to metrics, campaigns, customers, and payments.
- **UI Rendering:** Displays performance metrics, campaigns, referrals, and payment data using various child components.
- **State Management:** Handles loading and error states to ensure a smooth user experience.
- **Navigation:** Provides links to more detailed views for campaigns and payments.

## Component Props

- **DashboardProps:**
  - `accessToken?: string`
  - `refreshToken?: string`
  - `userId?: number`

These props are passed to the `useDashboard` hook to facilitate data fetching with the appropriate authentication tokens and user identification.

## Custom Hook: `useDashboard`

The `useDashboard` hook is a critical part of this component, responsible for:

- Fetching and managing the dashboard data.
- Handling session-related logic and token refresh.
- Returning various states such as `dataLoading`, `error`, `sessionLoading`, `metrics`, `prioritizedCampaigns`, `latestConversions`, `latestConversionColumns`, and `customers`.

## UI Components

### 1. `PerformanceSummary`

Displays key performance metrics such as total clicks, conversions, conversion rate, total spend, and CPA.

### 2. `CampaignItem`

Shows details about individual campaigns, including their status, start and end dates, and funding amount.

### 3. `ReferralCard`

Presents information about recent customer referrals, including the customer's name, location, email, and the date they were referred.

### 4. `DataTableHeader` and `DataTableRows`

Render the header and rows for the payment conversion data table, displaying the latest conversions with details such as date, referrer, and order information.

### 5. `LoadingOverlay`

A visual overlay that appears when data is loading or the session is being initialized, preventing user interaction until the process is complete.

### 6. `ScrollableContainer`

A wrapper component that allows horizontal scrolling of performance metrics.

## Error Handling

The component gracefully handles errors by:

- Logging errors to the console for debugging purposes.
- Displaying a user-friendly error message when data loading fails.
- Ensuring the rest of the UI remains functional even if some data fails to load.

## Loading States

The `DashboardIndex` component manages two loading states:

- **`sessionLoading`:** Indicates whether the session is being loaded or initialized.
- **`dataLoading`:** Indicates whether the dashboard data is currently being fetched.

During loading, the content is blurred, and a loading overlay is displayed to inform the user that the data is being processed.

## Layout and Styling

The layout is responsive and adapts to different screen sizes. The component uses Flexbox for alignment and spacing, and Tailwind CSS classes are applied for styling. The dashboard is divided into sections for metrics, campaigns, referrals, and payments, ensuring a clean and organized presentation.

## Conclusion

The `DashboardIndex` component is a comprehensive and user-friendly dashboard interface that integrates data fetching, state management, and UI rendering. By leveraging a custom hook and well-designed UI components, it provides brand users with critical insights and quick access to detailed information about their campaigns and payments.
