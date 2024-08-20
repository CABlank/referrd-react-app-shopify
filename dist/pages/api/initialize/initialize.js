// Secure initialization with environment variables and request validation
export function initialize(req) {
    var companyId = req.query.companyId;
    var BOT_TOKEN = process.env.BOT_TOKEN;
    if (!companyId || typeof companyId !== "string") {
        throw new Error("Invalid or missing companyId");
    }
    if (!BOT_TOKEN) {
        throw new Error("Missing BOT_TOKEN in environment variables");
    }
    return { companyId: companyId, BOT_TOKEN: BOT_TOKEN };
}
