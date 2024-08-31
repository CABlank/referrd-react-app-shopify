# Database Access Design Document

## Overview

The `database-access` folder within the `feature` directory of this project is responsible for managing interactions between the API and the database. This folder contains various API endpoints designed to handle specific tasks related to user authentication, token management, and session handling. The key files in this folder include `save-refresh-update.ts` and `session-load-checker.ts`, each of which performs distinct operations related to user sessions and token updates.

## Folder Structure

The `database-access` folder is structured as follows:

- **`save-refresh-update.ts`**: This file is responsible for updating and retrieving access and refresh tokens associated with a user. It handles POST requests to either update the tokens if the relevant information is provided or retrieve the refresh token if only the user ID is supplied.

- **`session-load-checker.ts`**: This file is responsible for updating session tokens and retrieving all token-related data for a specific user. It extends the functionality provided by `save-refresh-update.ts` by also managing session expiration and checking the validity of tokens.

- **`__tests__` Folder**: This folder contains test files for the API endpoints within the `database-access` directory. These tests are written using Jest and `node-mocks-http` to simulate HTTP requests and responses. The test files are designed to ensure the correctness of the logic implemented in the API endpoints.

## Key Functions

### save-refresh-update.ts

- **`updateTokens`**: This function updates the access and refresh tokens in the database for a specific user. It calculates the expiration date for the tokens and updates the relevant record in the database. If the user ID is not found, it throws an error.

- **`getRefreshToken`**: This function retrieves the refresh token from the database for a given user ID. If no token is found, it throws an error. This is typically used when the user’s access token needs to be refreshed but no new tokens are provided in the request.

- **API Handler**: The default export of this file is an asynchronous function that handles POST requests. It first checks the request method, then processes the request by either updating the tokens using `updateTokens` or retrieving the refresh token using `getRefreshToken`, depending on the data provided.

### session-load-checker.ts

- **`updateTokens`**: Similar to the `updateTokens` function in `save-refresh-update.ts`, this function updates the access and refresh tokens in the database, but it also manages the session expiration. It calculates both the token expiration and session expiration times, updating them in the database.

- **`getTokenData`**: This function retrieves all token-related data for a specific user ID from the database. It returns the access token, refresh token, session access token expiration time, and the token expiration time. If no token is found, it throws an error.

- **API Handler**: The default export of this file is an asynchronous function that handles POST requests. It checks if the request method is valid and processes the request by either updating the tokens and session expiration using `updateTokens` or retrieving all token data using `getTokenData`. This API handler provides a more comprehensive solution for managing user sessions compared to `save-refresh-update.ts`.

## Error Handling

Both API handlers include robust error handling mechanisms. They check for the validity of the request method and the presence of required data such as user IDs. If any errors occur during the database operations, such as failing to find a token or an issue during the update, the errors are caught, logged, and an appropriate HTTP error response is returned.

## Testing

The `__tests__` folder contains comprehensive test cases that simulate various scenarios for both `save-refresh-update.ts` and `session-load-checker.ts`. These tests include:

- **Method Validation**: Ensuring that only POST requests are allowed.
- **Input Validation**: Checking that required fields like `userId` or `apiRequestUserId` are provided and valid.
- **Token Update**: Verifying that tokens are correctly updated in the database when valid data is provided.
- **Token Retrieval**: Ensuring that the correct token data is retrieved from the database when requested.
- **Error Handling**: Confirming that appropriate errors are returned for invalid input or unexpected issues during database operations.

These tests are crucial for maintaining the integrity and reliability of the API endpoints, ensuring they behave as expected under different conditions.

## Conclusion

The `database-access` folder is a critical component of the backend infrastructure, responsible for managing user authentication tokens and session data. The well-structured and thoroughly tested code in this folder ensures that user sessions are handled securely and efficiently. By following best practices in API design, error handling, and testing, the components in this folder contribute to a robust and maintainable system.
