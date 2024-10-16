/**
 * This file sets up and applies middleware functions for verifying incoming requests to your Shopify application.
 * It ensures that requests pass through a series of verification steps, including request verification, proxy verification, and HMAC verification.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as Next.js types, middleware functions, and the `next-api-middleware` package.
 * 2. Labels Middleware Functions: It labels and applies the middleware functions to be used in the Next.js API routes.
 * 3. Exports the Middleware: Finally, it exports the configured middleware for use in your application.
 */
import { label } from "next-api-middleware"; // Import Middleware and label functions from next-api-middleware package
import proxyVerifier from "./proxyVerifier"; // Import custom proxy verifier middleware
import requestVerifier from "./verifyRequest"; // Import custom request verifier middleware
import hmacVerifier from "./hmacVerifier"; // Import custom HMAC verifier middleware
// Label and configure the middleware functions for use in API routes
var applyMiddleware = label({
    requestVerifier: requestVerifier,
    proxyVerifier: proxyVerifier,
    hmacVerifier: hmacVerifier,
});
export default applyMiddleware; // Export the configured middleware
