import { NextApiRequest } from "next";

// Secure initialization with environment variables and request validation
export function initialize(req: NextApiRequest): {
  companyId: string;
  BOT_TOKEN: string;
} {
  const { companyId } = req.query;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!companyId || typeof companyId !== "string") {
    throw new Error("Invalid or missing companyId");
  }

  if (!BOT_TOKEN) {
    throw new Error("Missing BOT_TOKEN in environment variables");
  }

  return { companyId, BOT_TOKEN };
}
