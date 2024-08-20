import crypto from "crypto"; // Import crypto module for HMAC calculation

interface JwtPayload {
  exp: number; // Expiration time
  [key: string]: any; // Include any additional properties
}

/**
 * Validate your JWT token against the secret.
 *
 * @param {string} token - JWT Token to be validated.
 * @param {string} [secret=process.env.SHOPIFY_API_SECRET] - Signature secret. By default uses the `process.env.SHOPIFY_API_SECRET` value.
 * @returns {JwtPayload} Decoded JWT payload.
 * @throws Will throw an error if the token structure is incorrect, the signature is invalid, or the token is expired.
 */
function jwtValidator(
  token: string,
  secret: string = process.env.SHOPIFY_API_SECRET as string
): JwtPayload {
  const parts = token.split("."); // Split the token into its three parts: header, payload, and signature
  if (parts.length !== 3) {
    throw new Error("JWT: Token structure incorrect"); // Throw an error if the token does not have exactly three parts
  }

  const header = parts[0]; // Extract the header part of the token
  const payload = parts[1]; // Extract the payload part of the token
  const signature = parts[2]; // Extract the signature part of the token

  const payloadJson = Buffer.from(payload, "base64").toString(); // Decode the base64-encoded payload to a JSON string
  const decodedPayload: JwtPayload = JSON.parse(payloadJson); // Parse the payload into a JSON object

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

  // Ensure the exp property exists in the decoded payload
  if (typeof decodedPayload.exp !== "number") {
    throw new Error(
      "JWT payload is missing the 'exp' (expiration time) property"
    );
  }

  // Check if the token has expired
  const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
  if (currentTime > decodedPayload.exp) {
    throw new Error("JWT: Token has expired"); // Throw an error if the token has expired
  }

  return decodedPayload; // Return the decoded payload as a JwtPayload object
}

export default jwtValidator; // Export the function
