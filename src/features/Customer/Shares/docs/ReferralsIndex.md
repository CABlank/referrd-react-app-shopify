# Referrals Feature - Design Document

## Overview

The `Referrals` folder within the `features` directory encapsulates all components, hooks, and services related to the referral system of the application. The referral feature allows users to manage and view referral programs, including customer referrals, referral performance metrics, and detailed referral data.

## Structure

- **Components:**

  - `ReferralsIndex.tsx`: This component serves as the main entry point for viewing the list of referrals. It displays key metrics such as the number of sign-ups, clicks, and conversions. The component provides functionalities like filtering, sorting, and paginating through the referral data.
  - `ReferralDetails.tsx`: This component is used to display detailed information about a specific referral. It includes performance metrics, detailed conversion data, and shares related to the referral.

- **Hooks:**

  - `useReferrals.ts`: This custom hook fetches and manages data related to customer referrals. It provides the data needed by the `ReferralsIndex` component, including the list of customers, their associated campaigns, and the loading and error states.
  - `useReferralDetails.ts`: This hook manages and provides detailed data for a specific referral. It is used by the `ReferralDetails` component to fetch and display detailed metrics and information for a single referral.

- **Services:**
  - The services associated with the referrals feature are typically located in a `services` folder, such as `referralsService.ts`. This service handles API calls related to referrals, including fetching referral lists, customer details, and campaign information.

## Design Considerations

- **Separation of Concerns:** The design separates concerns by dividing the feature into specific components and hooks. `ReferralsIndex.tsx` focuses on the list view and summary metrics, while `ReferralDetails.tsx` focuses on detailed data for individual referrals.
- **Reusability:** The use of custom hooks like `useReferrals` and `useReferralDetails` allows for reusability across different components. These hooks can be easily tested and maintained independently from the components that use them.
- **Error Handling:** The components are designed to handle various states, such as loading and error states, gracefully. This ensures a smooth user experience even when data fetching encounters issues.

- **Testing:** The `__tests__` folder contains comprehensive tests for each component, ensuring that all functionalities, including rendering, filtering, sorting, and pagination, work as expected. Mocks are used to isolate components and hooks during testing.

## Dependencies

- **React:** The core framework used to build the components.
- **Next.js:** Utilized for routing and server-side rendering, particularly with the `useRouter` hook.
- **React Testing Library:** Used for writing tests to ensure that components behave correctly.

## Future Enhancements

- **Enhanced Filtering and Sorting:** Future iterations could include more advanced filtering options, such as by date range or specific campaign metrics.
- **User Customization:** Allow users to customize the metrics they want to view on the `ReferralsIndex` page.
- **Real-time Data Updates:** Implement real-time updates for referral metrics using WebSockets or similar technologies.

## Conclusion

The `Referrals` feature is a critical component of the application, providing users with powerful tools to manage and analyze referral data. The design emphasizes modularity, reusability, and robust error handling, ensuring that the feature is both maintainable and scalable.
