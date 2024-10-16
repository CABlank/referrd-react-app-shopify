# Company Management Hooks Design Document

## Overview

This document provides an overview and explanation of the two main hooks used in the Company Management feature: `useCompanyList` and `useEditCompany`. These hooks manage the state, data fetching, and operations related to company management within the application.

---

## `useCompanyList`

### Purpose

The `useCompanyList` hook is responsible for managing the state and operations related to listing and creating companies. It fetches the list of companies, allows users to edit company details, and handles the submission of new or updated company data.

### Key Responsibilities

- Fetching and storing the list of companies.
- Managing the state of individual company details during the creation or editing process.
- Handling file uploads (for company logos).
- Managing loading and error states for the company list and individual operations.

### Hook API

- **companies**: `Company[]` - An array of company objects fetched from the server.
- **company**: `Company` - The current company object being created or edited.
- **logoPreview**: `string | null` - A preview URL of the company logo.
- **loading**: `boolean` - Indicates if data is currently being loaded.
- **error**: `string | null` - Stores any error message related to company operations.
- **logoError**: `string | null` - Stores any error message related to logo upload.
- **isEditingName**: `boolean` - Tracks whether the company name is currently being edited.
- **isEditingLogo**: `boolean` - Tracks whether the company logo is currently being edited.
- **handleChange**: `(field: keyof Company, value: any) => void` - Handles changes to company fields (e.g., name, domain).
- **handleFileChange**: `(file: File) => void` - Handles the logo file input change.
- **handleSave**: `() => Promise<void>` - Handles the saving (creation) of a new company.
- **handleFetchData**: `(url: string) => Promise<void>` - Fetches company data from a provided URL.
- **handleEditName**: `() => void` - Enables editing of the company name.
- **handleEditLogo**: `() => void` - Enables editing of the company logo.
- **setNeedsReload**: `(value: boolean) => void` - Forces a reload of the company list.

### Workflow

1. **Load Companies**: When the component using this hook is mounted, it fetches the list of companies if a valid session token is available.
2. **Field Change Handling**: Users can update company information, such as the name or logo. These changes are managed by the `handleChange` and `handleFileChange` functions.
3. **Saving Data**: The `handleSave` function submits the new or updated company data to the server.
4. **Fetch Data**: Users can fetch company data by providing a domain URL, which populates the company name and logo.
5. **Error Handling**: Errors encountered during data fetching or saving are stored in `error` or `logoError` and displayed in the UI.

---

## `useEditCompany`

### Purpose

The `useEditCompany` hook is designed to handle the operations required for editing an existing company or creating a new company. It manages the fetching of specific company data, updates to that data, and the submission of changes to the server.

### Key Responsibilities

- Fetching and storing company data for editing.
- Managing form input for the company details.
- Handling logo uploads and previews.
- Managing loading and error states for the company edit form.

### Hook API

- **company**: `Company` - The current company object being edited or created.
- **logoPreview**: `string | null` - A preview URL of the company logo.
- **loading**: `boolean` - Indicates if data is currently being loaded.
- **error**: `string | null` - Stores any error message related to company operations.
- **logoError**: `string | null` - Stores any error message related to logo upload.
- **handleChange**: `(field: keyof Company, value: any) => void` - Handles changes to company fields (e.g., name, domain).
- **handleFileChange**: `(e: React.ChangeEvent<HTMLInputElement>) => void` - Handles the logo file input change.
- **handleSubmit**: `() => Promise<void>` - Handles the submission of the edited company data to the server.

### Workflow

1. **Load Company**: Upon mounting, if a `companyId` is present in the route, the hook fetches the company data and populates the form fields.
2. **Field Change Handling**: Users can update the company name, domain, and logo using the `handleChange` and `handleFileChange` functions.
3. **Saving Data**: The `handleSubmit` function submits the changes made to the company data to the server.
4. **Error Handling**: Errors during data fetching or saving are managed and displayed via the `error` and `logoError` states.

---

## Summary

The `useCompanyList` and `useEditCompany` hooks encapsulate the logic required for managing company data in the application. They ensure that the Company Management feature is scalable, maintainable, and easy to integrate into the UI components.

These hooks provide a clean and reusable API for interacting with company data, handling both creation and editing workflows, and managing the associated state transitions effectively.

---

## File Structure

Below is the file structure where these hooks are located:

```plaintext
features/
└── Brand/
    └── Company/
        ├── components/
        ├── hooks/
        │   ├── useCompanyList.ts
        │   └── useEditCompany.ts
        ├── tests/
        ├── docs/
        ├── CompanyIndex.tsx
        └── EditCompany.tsx
```

Below is the documentation file for the hooks folder that contains useCompanyList and useEditCompany. You can copy and paste this content into a .md file in your /features/Brand/Company/docs directory.

markdown
