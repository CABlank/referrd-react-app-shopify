var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, campaignId, amountFunded, token, oldAmount, session, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(req.method === "POST")) return [3 /*break*/, 5];
                    _a = req.body, campaignId = _a.campaignId, amountFunded = _a.amountFunded, token = _a.token, oldAmount = _a.oldAmount;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, stripe.checkout.sessions.create({
                            payment_method_types: ["card"],
                            line_items: [
                                {
                                    price_data: {
                                        currency: "aud",
                                        product_data: {
                                            name: "Campaign ".concat(campaignId, " Funding"),
                                        },
                                        unit_amount: amountFunded * 100, // Stripe expects amount in cents
                                    },
                                    quantity: 1,
                                },
                            ],
                            mode: "payment",
                            success_url: "".concat(req.headers.origin, "/api/success?session_id={CHECKOUT_SESSION_ID}"),
                            cancel_url: "".concat(req.headers.origin, "/brand/campaigns?cancel"),
                            metadata: {
                                campaignId: campaignId.toString(),
                                token: token,
                                oldAmount: oldAmount,
                            },
                        })];
                case 2:
                    session = _b.sent();
                    res.status(200).json({ id: session.id });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    console.error("Error creating checkout session:", err_1);
                    res.status(500).json({ error: "Failed to create session" });
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    res.setHeader("Allow", "POST");
                    res.status(405).end("Method Not Allowed");
                    _b.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
