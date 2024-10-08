// pages/api/webhooks/orders-create.ts
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import axios from "axios";
import { createPayment } from "../../../services/payments/payments";
var BOT_TOKEN = process.env.BOT_TOKEN || "";
var API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.referrd.com.au";
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var orderData, importantInfo, campaignUUID, companyID, customerResponse, customerData, newConversionCount, error_1, paymentInfo, payment, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(req.method === "POST")) return [3 /*break*/, 10];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    orderData = req.body;
                    importantInfo = {
                        orderNumber: orderData.order_number,
                        customerEmail: orderData.contact_email,
                        totalPrice: orderData.current_total_price_set.shop_money.amount,
                        totalDiscounts: orderData.current_total_discounts_set.shop_money.amount,
                        lineItems: orderData.line_items.map(function (item) { return ({
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price_set.shop_money.amount,
                        }); }),
                        discountsApplied: orderData.discount_codes.length > 0
                            ? orderData.discount_codes
                            : "None",
                        referralUUID: orderData.note
                            ? (_a = orderData.note.match(/Referral UUID: ([\w-]+)/)) === null || _a === void 0 ? void 0 : _a[1]
                            : null,
                        status: "Pending",
                    };
                    // Log the important information to the console
                    console.log("Important Order Information:", JSON.stringify(importantInfo, null, 2));
                    campaignUUID = null;
                    companyID = null;
                    if (!importantInfo.referralUUID) return [3 /*break*/, 7];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, axios.get("".concat(API_URL, "/items/customers?filter[uuid][_eq]=").concat(importantInfo.referralUUID), {
                            headers: {
                                Authorization: "Bearer ".concat(BOT_TOKEN),
                            },
                        })];
                case 3:
                    customerResponse = _b.sent();
                    console.log("Customer response:", customerResponse.data);
                    customerData = customerResponse.data.data[0];
                    if (!customerData) return [3 /*break*/, 5];
                    campaignUUID = customerData.campaign_uuid;
                    companyID = customerData.company_id;
                    newConversionCount = customerData.conversion_count + 1;
                    return [4 /*yield*/, axios.patch("".concat(API_URL, "/items/customers/").concat(customerData.id), { conversion_count: newConversionCount }, {
                            headers: {
                                Authorization: "Bearer ".concat(BOT_TOKEN),
                            },
                        })];
                case 4:
                    _b.sent();
                    console.log("Successfully updated conversion count to ".concat(newConversionCount, " for customer ID ").concat(customerData.id));
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error("Error fetching or updating customer data:", error_1);
                    return [3 /*break*/, 7];
                case 7:
                    paymentInfo = __assign(__assign({}, importantInfo), { campaign_uuid: campaignUUID || "default-campaign-uuid", company_id: companyID || "default-company-id" });
                    return [4 /*yield*/, createPayment({
                            order_number: paymentInfo.orderNumber.toString(),
                            customer_email: paymentInfo.customerEmail,
                            total_price: paymentInfo.totalPrice,
                            total_discounts: paymentInfo.totalDiscounts,
                            line_items: paymentInfo.lineItems,
                            discounts_applied: paymentInfo.discountsApplied,
                            referral_uuid: paymentInfo.referralUUID || undefined, // Change 'null' to 'undefined'
                            status: paymentInfo.status,
                            campaign_uuid: paymentInfo.campaign_uuid,
                            company_id: paymentInfo.company_id,
                            date_created: "",
                        }, BOT_TOKEN)];
                case 8:
                    payment = _b.sent();
                    if (payment) {
                        console.log("Payment item created in Directus:", payment);
                    }
                    else {
                        console.error("Failed to create payment in Directus.");
                    }
                    // Respond to Shopify with a 200 status to acknowledge receipt
                    return [2 /*return*/, res.status(200).send("Webhook processed")];
                case 9:
                    error_2 = _b.sent();
                    console.error("Error processing webhook:", error_2);
                    return [2 /*return*/, res.status(500).send("Internal Server Error")];
                case 10:
                    // If the request method is not POST, respond with a 404 status
                    res.status(404).send("Not found");
                    return [2 /*return*/];
            }
        });
    });
}
