// components/campaign/PaymentForm.tsx
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
import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from "../../context/SessionContext";
var PaymentForm = function (_a) {
    var campaignId = _a.campaignId, amountFunded = _a.amountFunded, oldAmount = _a.oldAmount, onSuccess = _a.onSuccess, // Destructure onSuccess from props
    disabled = _a.disabled;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var stripe = useStripe();
    var elements = useElements();
    var withTokenRefresh = useSession().withTokenRefresh;
    var handlePayment = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, id, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    if (!stripe || !elements) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, withTokenRefresh(function (token) { return Promise.resolve(token); })];
                case 2:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("/api/create-checkout-session", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                amountFunded: amountFunded,
                                campaignId: campaignId,
                                token: token,
                                oldAmount: oldAmount,
                            }),
                        })];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    id = (_a.sent()).id;
                    return [4 /*yield*/, stripe.redirectToCheckout({ sessionId: id })];
                case 5:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Stripe checkout error:", error);
                        setLoading(false);
                    }
                    else {
                        onSuccess(); // Call onSuccess callback after successful payment
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Payment error:", error_1);
                    setLoading(false);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handlePayment}>
      <button type="submit" disabled={!stripe || loading || disabled} className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775] text-white">
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>);
};
export default PaymentForm;
