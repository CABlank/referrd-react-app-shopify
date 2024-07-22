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
import React, { useState, useEffect, useRef } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from "../../contexts/SessionContext";
var PaymentFormInlineContent = function (_a) {
    var campaign = _a.campaign, loading = _a.loading, handlePayment = _a.handlePayment, amount = _a.amount, setAmount = _a.setAmount;
    var _b = useState(80), inputWidth = _b[0], setInputWidth = _b[1];
    var spanRef = useRef(null);
    useEffect(function () {
        if (spanRef.current) {
            var newWidth = Math.max(80, spanRef.current.offsetWidth + 20);
            setInputWidth(newWidth);
        }
    }, [amount]);
    var handleAmountChange = function (e) {
        setAmount(e.target.value);
    };
    return (<div className="flex flex-col sm:flex-row w-full">
      <form onSubmit={handlePayment} className="flex flex-col sm:flex-row w-full">
        <button type="submit" disabled={loading || !amount} className="text-white cursor-pointer flex justify-center items-center gap-2.5 px-4 py-1.5 bg-[#47B775] border border-[#47B775] rounded-tl sm:rounded-tr-none sm:rounded-bl-none h-8">
          {amount ? "Submit" : "Payment"}
        </button>
        <div className="flex justify-center items-center py-1.5 border border-gray-500 sm:border-l-0 sm:rounded-tr sm:rounded-br h-8">
          {amount && (<div className="flex items-left px-1 bg-transparent">
              <span className="text-gray-700">$</span>
            </div>)}
          <input type="number" value={amount} onChange={handleAmountChange} className="ml-2 bg-transparent border-none outline-none text-gray-700 text-left appearance-none" style={{
            width: "".concat(inputWidth, "px"),
            textAlign: amount ? "left" : "center",
        }} placeholder="Enter amount" min="20" step="10" required/>
          <span ref={spanRef} className="absolute invisible whitespace-nowrap">
            {amount || "Enter amount"}
          </span>
        </div>
      </form>
    </div>);
};
var PaymentFormInline = function (_a) {
    var campaign = _a.campaign, loading = _a.loading;
    var _b = useState(false), internalLoading = _b[0], setInternalLoading = _b[1];
    var _c = useState(""), amount = _c[0], setAmount = _c[1];
    var withTokenRefresh = useSession().withTokenRefresh;
    var stripe = useStripe();
    var elements = useElements();
    var handlePayment = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, id, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    if (!stripe || !elements || !amount) {
                        return [2 /*return*/];
                    }
                    setInternalLoading(true);
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
                                amountFunded: parseFloat(amount),
                                campaignId: campaign.id,
                                token: token,
                                oldAmount: campaign.amountFunded || 0,
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
                        setInternalLoading(false);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Payment error:", error_1);
                    setInternalLoading(false);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<PaymentFormInlineContent campaign={campaign} loading={internalLoading || loading} handlePayment={handlePayment} amount={amount} setAmount={setAmount}/>);
};
export default PaymentFormInline;
