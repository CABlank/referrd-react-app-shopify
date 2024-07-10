import appUninstallHandler from "./appUninstallHandler";
import fetchMock from "jest-fetch-mock";

describe("appUninstallHandler", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should handle APP_UNINSTALLED webhook correctly", async () => {
    const topic = "APP_UNINSTALLED";
    const shop = "test-shop.myshopify.com";
    const webhookRequestBody = JSON.stringify({});

    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [JSON.stringify({}), { status: 200 }]
    );

    await appUninstallHandler(topic, shop, webhookRequestBody);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      `${DIRECTUS_URL}/items/sessions`,
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        }),
        body: JSON.stringify({ filter: { shop } }),
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${DIRECTUS_URL}/items/stores/upsert`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        }),
        body: JSON.stringify({
          filter: { shop },
          update: { isActive: false },
          create: { shop, isActive: false },
        }),
      })
    );
  });

  it("should log an error for unexpected webhook topics", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const topic = "UNEXPECTED_TOPIC";
    const shop = "test-shop.myshopify.com";
    const webhookRequestBody = JSON.stringify({});

    await appUninstallHandler(topic, shop, webhookRequestBody);

    expect(consoleSpy).toHaveBeenCalledWith(`Unexpected topic: ${topic}`);
    expect(fetchMock).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should log an error if fetch fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const topic = "APP_UNINSTALLED";
    const shop = "test-shop.myshopify.com";
    const webhookRequestBody = JSON.stringify({});
    const errorMessage = "Network error";

    fetchMock.mockRejectOnce(new Error(errorMessage));

    await appUninstallHandler(topic, shop, webhookRequestBody);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error handling APP_UNINSTALLED for shop: ${shop}`
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `Webhook Request Body: ${webhookRequestBody}`
    );
    expect(consoleSpy).toHaveBeenCalledWith(`Error: ${errorMessage}`);

    consoleSpy.mockRestore();
  });
});
