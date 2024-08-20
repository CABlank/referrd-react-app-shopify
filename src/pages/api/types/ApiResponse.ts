/**
 * ApiResponse type definition for the API response structure.
 *
 * This defines the structure of the response object that will be returned by the API handler,
 * ensuring that the response adheres to the expected format.
 */
export type ApiResponse = {
  success: boolean;
  htmlContent?: string;
  message?: string;
};
