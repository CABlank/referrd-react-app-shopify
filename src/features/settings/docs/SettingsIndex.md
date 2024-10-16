# Design Document: Settings Module

The `Settings` module within the `features/Brand/Settings` directory is responsible for managing the settings functionality of the application. This module includes several components and a custom hook, each playing a specific role in handling the settings form, interacting with the settings API, and managing state within the application. Below is a detailed explanation of each file within this module.

### 1. `SettingsIndex.tsx`

`SettingsIndex` is the primary component that brings together all the other components and the custom hook within the `Settings` module. It is responsible for fetching, displaying, and managing the settings form. The main responsibilities include:

- **Fetching settings data**: It uses the `useSettings` hook to fetch the current settings data when the component is mounted.
- **Displaying a loading overlay**: If the settings data is still loading, a `LoadingOverlay` component is rendered to indicate to the user that the data is being fetched.
- **Rendering the `SettingsForm` component**: The `SettingsForm` component is passed the settings data, error messages, and handler functions to manage form inputs and submissions.
- **Error Handling**: Displays an error message if fetching or saving settings fails.

### 2. `SettingsForm.tsx`

`SettingsForm` is a form component that allows users to view and modify various settings related to their brand. It composes two main subcomponents: `BrandInformationForm` and `NotificationsForm`. The responsibilities include:

- **Receiving and displaying settings data**: The component receives settings data and error messages as props and displays them in the relevant input fields.
- **Handling input changes**: The component uses the `handleChange` prop to update the state when the user modifies any of the input fields.
- **Submitting the form**: The `handleSave` function is called when the user clicks the "Save" button, triggering a save operation for the settings data.

### 3. `BrandInformationForm.tsx`

`BrandInformationForm` is a subcomponent of `SettingsForm` that manages the input fields related to the brand's basic information, such as `Brand Name`, `Contact Name`, `Mobile`, `Email`, `Country`, and `Business Address`. It is responsible for:

- **Displaying brand information fields**: It renders input fields for each piece of brand information, prefilled with the current settings data.
- **Handling user input**: The component updates the state when the user makes changes to any of the input fields.
- **Google Places Autocomplete**: Uses the `GooglePlacesAutocomplete` component to provide address suggestions as the user types in the `Business Address` field.

### 4. `NotificationsForm.tsx`

`NotificationsForm` is another subcomponent of `SettingsForm`, responsible for managing the notification preferences of the user. It includes several toggle switches for different notification settings, such as:

- **Referral Conversions**: Notifies the user when a referral conversion happens.
- **Payment Confirmation**: Notifies the user when a payment confirmation occurs.
- **Payment Notifications**: Sends notifications for other payment-related activities.
- **No Payment Notifications**: Disables all payment notifications.

This component's responsibilities include rendering the notification toggles and handling state updates when the user toggles these settings on or off.

### 5. `NotificationToggle.tsx`

`NotificationToggle` is a reusable component used by `NotificationsForm` to render each notification setting as a toggle switch. It includes:

- **Toggle UI**: Displays a label and a button, which shows either a filled or unfilled checkbox depending on the current state of the toggle.
- **Handling user actions**: Calls the `onChange` function passed as a prop whenever the user clicks the toggle button, updating the notification setting.

### 6. `useSettings.tsx`

`useSettings` is a custom React hook that handles the fetching, updating, and saving of settings data. It provides the main logic for interacting with the settings API and manages the state of the settings form. The responsibilities of this hook include:

- **Fetching settings**: It fetches the current settings from the API when the component using the hook mounts.
- **Managing state**: The hook maintains the current settings, loading status, and error messages using the React `useState` hook.
- **Handling input changes**: Provides a `handleChange` function to update specific fields in the settings data.
- **Saving settings**: Includes logic for saving the settings, either by creating new settings or updating existing ones, depending on whether the settings data has an `id`.
- **Error Handling**: Manages and displays error messages when API requests fail during fetching or saving settings.

### Summary

The `Settings` module is designed to provide a robust and user-friendly interface for managing brand settings within the application. Each component and hook is modular and handles a specific aspect of the settings management process, from fetching and displaying data to handling user input and saving changes. The use of reusable components like `NotificationToggle` and modular design with subcomponents like `BrandInformationForm` and `NotificationsForm` helps keep the codebase organized and maintainable.
