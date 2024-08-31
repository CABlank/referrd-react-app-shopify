# Company Components Design Document

## Overview

This document provides an overview of the key components used in the Company Management feature, specifically `CompanyCard.tsx` and `FetchCompanyData.tsx`. These components play crucial roles in displaying and managing company data within the application.

---

## `CompanyCard.tsx`

### Purpose

The `CompanyCard.tsx` component is responsible for displaying individual company information, including the company name, domain, logo, and creation date. It also provides a link to edit the company details.

### Key Components

- **Image**: Renders the company's logo if available, otherwise displays a fallback logo.
- **FallbackLogo**: A component that displays a placeholder logo if the company's logo is not available.
- **CalendarIcon**: An icon representing the company's creation date.
- **EditIcon**: An icon used to trigger the editing of the company's details.
- **LinkIcon**: An icon representing the company's website link.
- **useRouter**: A Next.js hook that allows navigation to the edit page when the "Edit" button is clicked.

### Workflow

1. **Logo Display**: The component first checks if a `logoUrl` exists for the company. If it does, the logo is displayed using the `Image` component; otherwise, the `FallbackLogo` is shown.
2. **Company Information**: Displays the company's name, domain (as a clickable link), and creation date.
3. **Edit Functionality**: An "Edit" button is provided, which redirects the user to the company's edit page when clicked.

---

## `FetchCompanyData.tsx`

### Purpose

The `FetchCompanyData.tsx` component allows users to fetch and display company data based on a provided URL. It also enables the user to edit the company name and logo.

### Key Components

- **useCompanyList Hook**: Manages the state and actions related to company data fetching, editing, and saving.
- **Input Fields**: Text inputs for entering the company's website URL and name.
- **File Input**: Allows the user to upload a company logo.
- **EditIcon**: An icon used to trigger the editing of the company name and logo.

### Workflow

1. **URL Input**: The user provides a company's website URL to fetch data. The `handleFetchData` function is called to retrieve the company data.
2. **Company Data Display**: If company data is successfully fetched, it is displayed in the component. The user can edit the company name and logo if needed.
3. **Logo Upload**: The user can upload a new logo for the company. The uploaded logo is previewed in the component.
4. **Error Handling**: If there are any errors during data fetching or logo uploading, error messages are displayed accordingly.

### UI/UX Considerations

- **Input Validation**: The URL input is validated to ensure a valid domain is provided.
- **Loading States**: The component shows loading indicators when fetching data or saving changes.
- **Error Messaging**: Clear error messages are provided for issues such as invalid URLs or failed data fetching.

---

## Summary

The `CompanyCard.tsx` and `FetchCompanyData.tsx` components are essential for managing company information within the application. `CompanyCard.tsx` provides a clean and concise display of company data, while `FetchCompanyData.tsx` offers a user-friendly interface for fetching and editing company information.

---
