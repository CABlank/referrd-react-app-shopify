# Stripe Integration - Design Document

## Overview

The `stripe` folder within the `feature` directory of this project is responsible for handling payment-related functionalities using the Stripe API. This folder contains API endpoint implementations for creating and managing payment intents and updating campaign statuses based on payment results. The folder also includes comprehensive unit tests to ensure that these functionalities work as expected.

## Folder Structure

The `stripe` folder is structured as follows:

- **`create-payment-intent.ts`**: This file contains the API endpoint for creating a new Stripe payment intent. It handles POST requests, validates input, and interacts with the Stripe API to create a payment intent based on the provided campaign details. The response includes the `client_secret` required to complete the payment on the client side.

- **`update-campaign.ts`**: This file manages the update of campaign statuses based on the outcome of a Stripe payment intent. After confirming the payment status, it updates the corresponding campaign’s funding amount and status in the database.

- **`__tests__` Folder**: This folder contains unit tests for the API endpoints. The tests utilize `jest` and `node-mocks-http` to simulate HTTP requests and mock the behavior of the Stripe API and related services.

## Key Files and Their Functionalities

### 1. **create-payment-intent.ts**

- **Purpose**: Handles the creation of a Stripe payment intent for a campaign. This is a critical step in the payment process, allowing users to securely process payments through Stripe.
- **Core Functionality**:

  - **Input Validation**: Validates the incoming POST request to ensure that all required fields (e.g., `campaignId`, `amountFunded`, `token`, `oldAmount`) are present.
  - **Stripe Interaction**: Uses the Stripe API to create a payment intent. The amount is calculated in cents, and additional metadata like `campaignId` and `token` is attached to the payment intent for tracking.
  - **Response Handling**: If successful, the API responds with a status of 200 and the `client_secret` for the payment intent. In case of errors (e.g., issues with Stripe), it logs the error and responds with a status of 500.

- **Error Handling**: Properly catches and logs any errors that occur during the Stripe API interaction, ensuring that any issues are reported and handled gracefully.

### 2. **update-campaign.ts**

- **Purpose**: Updates a campaign’s funding status based on the results of a Stripe payment intent. This ensures that the campaign's records accurately reflect the payment outcome.

- **Core Functionality**:

  - **Payment Intent Retrieval**: Retrieves the payment intent from Stripe using the `paymentIntentId` provided in the request. This step verifies whether the payment was successful.
  - **Campaign Update**: If the payment succeeded, the campaign’s funding status and amount are updated in the database. This is achieved by calling the `updateCampaignStatusAndAmount` service function.
  - **Response Handling**: Returns a success response if the campaign is updated successfully. If the payment did not succeed or an error occurs, it responds with the appropriate error message and status code.

- **Error Handling**: Includes detailed error handling to manage issues such as failed payment intents or database update errors, ensuring that the user is informed of any problems.

### 3. **Unit Tests in `__tests__` Folder**

- **Purpose**: Provides comprehensive testing for the Stripe integration endpoints, ensuring that all functionalities are working correctly and robustly.

- **Tests Covered**:

  - **Success Scenarios**: Tests that payment intents are created successfully, and campaigns are updated as expected when payments succeed.
  - **Error Scenarios**: Simulates failures such as Stripe API errors and ensures that these are handled correctly, with the appropriate status codes and error messages returned.
  - **Method Validation**: Ensures that only POST requests are accepted, with other methods returning a 405 Method Not Allowed status.

- **Mocking and Isolation**: Uses Jest to mock Stripe API calls and the `updateCampaignStatusAndAmount` service. This isolation ensures that tests are focused on the logic within the API endpoints and not on external dependencies.

## Conclusion

The `stripe` folder is a critical component of the payment processing system in this project. It leverages the Stripe API to manage payment intents and ensure that campaign funding statuses are accurately reflected based on payment outcomes. The code is thoroughly tested, with unit tests simulating various scenarios to guarantee reliability. By following best practices in API design, error handling, and testing, the Stripe integration in this project is both robust and maintainable.
