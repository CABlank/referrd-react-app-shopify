// update-campaign.test.ts

import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { updateCampaignStatusAndAmount } from "../../../../services/campaign/campaign";
import handler from "../create-payment-intent";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

jest.mock("stripe", () => {
  const originalModule = jest.requireActual("stripe");
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => ({
      paymentIntents: {
        retrieve: jest.fn(),
      },
    })),
  };
});

jest.mock("../../../../services/campaign/campaign");

const MockedStripe = stripe as jest.Mocked<Stripe>;

describe("API Endpoint - update-campaign", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockReqRes = () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        paymentIntentId: "pi_123",
        campaignId: 1,
        amountFunded: 100,
        token: "token_123",
        oldAmount: 200,
      },
    });
    req.env = process.env;
    return { req, res };
  };

  it("handles failure in retrieving payment intent", async () => {
    const { req, res } = mockReqRes();

    const mockRetrieve = MockedStripe.paymentIntents
      .retrieve as jest.MockedFunction<
      typeof MockedStripe.paymentIntents.retrieve
    >;

    mockRetrieve.mockRejectedValueOnce(new Error("Stripe API error"));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: "Failed to create payment intent",
    });
  });

  it("returns 405 for non-POST methods", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    req.env = process.env;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res.getHeader("Allow")).toBe("POST");
  });
});
