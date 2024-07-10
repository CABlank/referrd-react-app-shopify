/**
 * This file defines middleware to add Content Security Policy (CSP) headers to matched requests in a Next.js application.
 * It ensures that requests to specific routes include CSP headers for security.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required types and utilities from Next.js.
 * 2. Configures Route Matching: It sets up route matching to exclude specific routes and file types from the middleware.
 * 3. Defines Middleware Function: It defines a function to add CSP headers to the matched requests.
 * 4. Exports Middleware Configuration and Function: Finally, it exports the route matching configuration and the middleware function.
 */

import { NextResponse, NextRequest } from "next/server"; // Import Next.js response and request types

// Route matching configuration to exclude specific routes and file types
export const config = {
  matcher: [
    /*
     * Exceptions:
     * /api/auth, /api/webhooks, /api/proxy_route, /api/gdpr, /_next,
     * /_proxy, /_auth, /_static, /_vercel, /public (/favicon.ico, etc)
     */
    "/((?!api/auth|api/webhooks|api/proxy_route|api/gdpr|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

/**
 * Middleware to add Content Security Policy headers to matched requests.
 *
 * @function middleware
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} The response object with modified headers.
 */
export function middleware(request: NextRequest): NextResponse {
  const {
    nextUrl: { search },
  } = request;

  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const shop = params.shop || "*.myshopify.com";

  const res = NextResponse.next();
  res.headers.set(
    "Content-Security-Policy",
    `frame-ancestors https://${shop} https://admin.shopify.com;`
  );

  return res;
}
