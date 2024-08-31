# Company Management Feature Design Document

## Overview

The Company Management feature allows users to create, edit, and view companies within the application. This feature includes two main pages: `CompanyIndex.tsx` and `EditCompany.tsx`. This document outlines the design, functionality, and key components of these pages.

---

## `CompanyIndex.tsx`

### Purpose

The `CompanyIndex.tsx` component serves as the main entry point for managing companies. It lists all the existing companies and provides an interface for users to fetch new company data or edit existing companies.

### Key Components

- **Spinner**: Displays a loading indicator when data is being fetched.
- **FetchCompanyData**: A form allowing users to enter a domain and fetch company data from an external source.
- **CompanyCard**: Displays individual company information, including the company name, domain, and logo, with an option to edit the company details.
- **useCompanyList Hook**: Manages the state and data fetching for the list of companies.

### Workflow

1. **Loading State**: While the company data is being fetched, a `Spinner` is shown.
2. **Error Handling**: If there is an error fetching company data, an error message is displayed.
3. **Empty State**: If no companies are found, the `FetchCompanyData` form is displayed, allowing the user to fetch data for a new company.
4. **Company List**: If companies exist, they are displayed using the `CompanyCard` component, which includes the company's name, domain, and logo.

---

## `EditCompany.tsx`

### Purpose

The `EditCompany.tsx` component is used for creating a new company or editing an existing one. It provides a form where users can input the company's name, domain, and logo.

### Key Components

- **useEditCompany Hook**: Manages the state, data fetching, and form submission for editing or creating a company.
- **LoadingOverlay**: A component that displays a loading overlay when the form is submitting or loading data.
- **FallbackLogo**: A placeholder logo that is displayed when no logo is provided for the company.

### Workflow

1. **Initial Load**: The form is pre-populated with the company's existing data if editing an existing company.
2. **Form Inputs**:
   - **Company Name**: Text input for the company name.
   - **Domain**: Text input for the company's domain (disabled if editing).
   - **Logo**: File input for uploading a company logo. Displays a preview of the logo if one is already uploaded.
3. **Form Submission**: When the user clicks "Save", the `handleSubmit` function is called, which either creates a new company or updates an existing one.
4. **Error Handling**: If there are errors during form submission, they are displayed above the form.

### UI/UX Considerations

- The form is designed to be simple and intuitive, with clear labels and error messages.
- The "Save" button is disabled while the form is submitting to prevent duplicate submissions.
- The `LoadingOverlay` provides visual feedback during data fetching and submission, ensuring the user is aware of ongoing processes.

---

## Summary

These components are crucial for the functionality of the Company Management feature, providing users with the ability to manage company information effectively. The structure and flow of data are managed by custom hooks, ensuring a clean separation of concerns and reusability across the application.

By following this design, the application ensures that company data is easy to manage, with clear feedback and error handling to guide users through the process.

---
