import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import handler from "../create-payment-intent";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Unit tests for the handler
describe("Payment Intent API Endpoint Tests", () => {
  it("should create a payment intent and return client secret", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        campaignId: 123,
        amountFunded: 50,
        token: "test_token",
        oldAmount: 25,
      },
    });

    // Extend req with missing properties to match NextApiRequest
    Object.assign(req, { env: process.env });

    // Mock Stripe's response
    stripe.paymentIntents.create = jest.fn().mockResolvedValueOnce({
      client_secret: "test_client_secret",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      clientSecret: "test_client_secret",
    });
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 5000, // 50 AUD * 100
      currency: "aud",
      metadata: {
        campaignId: "123",
        token: "test_token",
        oldAmount: 25,
      },
    });
  });

  it("should handle errors during payment intent creation", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        campaignId: 123,
        amountFunded: 50,
        token: "test_token",
        oldAmount: 25,
      },
    });

    // Extend req with missing properties to match NextApiRequest
    Object.assign(req, { env: process.env });

    // Mock an error from Stripe
    stripe.paymentIntents.create = jest
      .fn()
      .mockRejectedValueOnce(new Error("Stripe API error"));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: "Failed to create payment intent",
    });
  });

  it("should return 405 if the method is not POST", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    // Extend req with missing properties to match NextApiRequest
    Object.assign(req, { env: process.env });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res.getHeader("Allow")).toBe("POST");
  });
});
