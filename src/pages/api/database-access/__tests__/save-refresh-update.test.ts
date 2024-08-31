import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handleRequest from "../save-refresh-update"; // Adjust the import if necessary
import { prisma } from "../../../../lib/prisma"; // Adjust the import if necessary

jest.mock("../../../../lib/prisma", () => ({
  prisma: {
    token: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

describe("API Endpoint - save-refresh-update", () => {
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

  it("should return 400 if userId is missing or invalid", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = { userId: "abc" };

    await handleRequest(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Invalid or missing userId" });
  });

  it("should return an error if no token found for the userId", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = {
      userId: 1,
      accessToken: "abc",
      refreshToken: "xyz",
      expires: 3600,
    };
    (prisma.token.findFirst as jest.Mock).mockResolvedValue(null);

    await handleRequest(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error");
    expect(prisma.token.findFirst).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
  });

  it("should update tokens if valid data is provided", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = {
      userId: 1,
      accessToken: "abc",
      refreshToken: "xyz",
      expires: 3600,
    };

    const mockToken = { id: 1 };
    (prisma.token.findFirst as jest.Mock).mockResolvedValue(mockToken);
    (prisma.token.update as jest.Mock).mockResolvedValue({});

    await handleRequest(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Tokens updated successfully",
    });
    expect(prisma.token.update).toHaveBeenCalledWith({
      where: { id: mockToken.id },
      data: expect.objectContaining({
        accessToken: "abc",
        refreshToken: "xyz",
      }),
    });
  });

  it("should return the refresh token if only userId is provided", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = { userId: 1 };

    const mockToken = { refreshToken: "xyz" };
    (prisma.token.findFirst as jest.Mock).mockResolvedValue(mockToken);

    await handleRequest(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ refreshToken: "xyz" });
  });

  it("should handle unexpected errors", async () => {
    const { req, res } = mockReqRes();
    req.method = "POST";
    req.body = {
      userId: 1,
      accessToken: "abc",
      refreshToken: "xyz",
      expires: 3600,
    };
    (prisma.token.findFirst as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    await handleRequest(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Unexpected error" });
  });
});
