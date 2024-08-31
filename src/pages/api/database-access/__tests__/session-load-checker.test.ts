// session-load-checker.test.ts

import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handleRequest from "../session-load-checker"; // Adjust the import if necessary
import { prisma } from "../../../../lib/prisma"; // Adjust the import if necessary

jest.mock("../../../../lib/prisma", () => ({
  prisma: {
    token: {
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

describe("API Endpoint - session-load-checker", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockReqRes = () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req.env = process.env; // Manually add the 'env' property to mock request
    return { req, res };
  };

  it("should return 405 if the method is not POST", async () => {
    const { req, res } = mockReqRes();
    req.method = "GET";

    await handleRequest(req, res);

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
  });

  it("should return 400 if apiRequestUserId is missing or invalid", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = { apiRequestUserId: "abc" };

    await handleRequest(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Invalid or missing userId" });
  });

  it("should update tokens if valid data is provided", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = {
      apiRequestUserId: 1,
      accessToken: "abc",
      refreshToken: "xyz",
      expires: 3600,
      sessionAccessTokenExpiration: 5400,
    };

    (prisma.token.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    await handleRequest(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Tokens updated successfully",
      accessToken: "abc",
      refreshToken: "xyz",
      sessionAccessTokenExpiration: expect.any(String), // Expecting a date string
    });
    expect(prisma.token.updateMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      data: expect.objectContaining({
        accessToken: "abc",
        refreshToken: "xyz",
      }),
    });
  });

  it("should return token data if no tokens provided in request", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = { apiRequestUserId: 1 };

    const mockTokenData = {
      accessToken: "abc",
      refreshToken: "xyz",
      sessionAccessTokenExpiresAt: new Date(),
      expiresAt: new Date(),
    };

    (prisma.token.findFirst as jest.Mock).mockResolvedValue(mockTokenData);

    await handleRequest(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      accessToken: "abc",
      refreshToken: "xyz",
      sessionAccessTokenExpiresAt: expect.any(String), // Expecting a date string
      expires: expect.any(String), // Expecting a date string
    });
    expect(prisma.token.findFirst).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
  });

  it("should handle unexpected errors during token update", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = {
      apiRequestUserId: 1,
      accessToken: "abc",
      refreshToken: "xyz",
      expires: 3600,
      sessionAccessTokenExpiration: 5400,
    };

    (prisma.token.updateMany as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    await handleRequest(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Unexpected error" });
  });

  it("should handle unexpected errors during token retrieval", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = { apiRequestUserId: 1 };

    (prisma.token.findFirst as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    await handleRequest(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Unexpected error" });
  });
});
