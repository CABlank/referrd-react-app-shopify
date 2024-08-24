import shopify from "../../../shopify/shopifyClient";
import { RequestedTokenType } from "@shopify/shopify-api";

export const exchangeTokenWithShopify = async (
  shop: string,
  idToken: string
) => {
  const { session: onlineSession } = await shopify.auth.tokenExchange({
    sessionToken: idToken,
    shop,
    requestedTokenType: RequestedTokenType.OnlineAccessToken,
  });

  if (!onlineSession?.accessToken) {
    throw new Error("Failed to obtain a valid online session.");
  }

  return onlineSession;
};
