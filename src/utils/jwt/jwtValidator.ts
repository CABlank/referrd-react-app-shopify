/**
 * This file provides a function to validate JWT tokens against a secret.
 * It ensures that the JWT token is correctly structured, verifies its signature, and decodes the payload.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports the `crypto` module for HMAC calculation.
 * 2. Validates JWT Token: It defines a function `jwtValidator` to validate the structure and signature of a JWT token.
 * 3. Verifies Token Signature: It verifies the JWT signature using HMAC and a secret.
 * 4. Decodes and Returns Payload: It decodes the payload of the JWT token and returns it as an object.
 * 5. Exports the Function: Finally, it exports the `jwtValidator` function for use in your application.
 */

import crypto from "crypto"; // Import crypto module for HMAC calculation

/**
 * Validate your JWT token against the secret.
 *
 * @param {string} token - JWT Token to be validated.
 * @param {string} [secret=process.env.SHOPIFY_API_SECRET] - Signature secret. By default uses the `process.env.SHOPIFY_API_SECRET` value.
 * @returns {object} Decoded JWT payload.
 * @throws Will throw an error if the token structure is incorrect or the signature is invalid.
 */
function jwtValidator(
  token: string,
  secret: string = process.env.SHOPIFY_API_SECRET as string
): object {
  const parts = token.split("."); // Split the token into its three parts: header, payload, and signature
  if (parts.length !== 3) {
    throw new Error("JWT: Token structure incorrect"); // Throw an error if the token does not have exactly three parts
  }

  const header = parts[0]; // Extract the header part of the token
  const payload = parts[1]; // Extract the payload part of the token
  const signature = parts[2]; // Extract the signature part of the token

  const headerJson = Buffer.from(header, "base64").toString(); // Decode the base64-encoded header to a JSON string
  const payloadJson = Buffer.from(payload, "base64").toString(); // Decode the base64-encoded payload to a JSON string

  // Verify the signature using HMAC with SHA256 and the provided secret
  const signatureCheck = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64");

  // Modify the signature to match URL-safe base64 encoding
  const safeSignatureCheck = signatureCheck
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  if (safeSignatureCheck !== signature) {
    throw new Error("Invalid token signature"); // Throw an error if the signature does not match
  }

  return JSON.parse(payloadJson); // Return the decoded payload as a JSON object
}

export default jwtValidator; // Export the function
