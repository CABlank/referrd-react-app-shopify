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
import { updateCampaignStatusAndAmount } from "../../services/campaign/campaign";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var session_id, session, campaignId, token, amountFunded, oldAmount, newTotalAmount, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    session_id = req.query.session_id;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, stripe.checkout.sessions.retrieve(session_id)];
                case 2:
                    session = _d.sent();
                    campaignId = ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.campaignId)
                        ? parseInt(session.metadata.campaignId, 10)
                        : null;
                    token = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.token;
                    amountFunded = session.amount_total ? session.amount_total / 100 : 0;
                    oldAmount = ((_c = session.metadata) === null || _c === void 0 ? void 0 : _c.oldAmount)
                        ? parseFloat(session.metadata.oldAmount)
                        : 0;
                    if (!campaignId) return [3 /*break*/, 4];
                    newTotalAmount = oldAmount + amountFunded;
                    return [4 /*yield*/, updateCampaignStatusAndAmount(campaignId, newTotalAmount, token !== null && token !== void 0 ? token : "")];
                case 3:
                    _d.sent();
                    console.log("Updated campaign ".concat(campaignId, " with amount ").concat(newTotalAmount));
                    return [3 /*break*/, 5];
                case 4:
                    console.log("No campaign ID found in session metadata");
                    _d.label = 5;
                case 5:
                    // Redirect to the campaigns page
                    res.writeHead(302, { Location: "/brand/campaigns" });
                    res.end();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _d.sent();
                    console.error("Error retrieving session:", err_1);
                    res.status(500).json({ error: "Failed to retrieve session" });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
