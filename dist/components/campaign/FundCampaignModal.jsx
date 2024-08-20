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
import { useRouter } from "next/router"; // Import the useRouter hook from Next.js
import StripeWrapper from "./StripeWrapper";
import PaymentForm from "./PaymentForm";
import Spinner from "../common/Spinner";
import { updateCampaignStatus } from "../../services/campaign/campaign";
var FundCampaignModal = function (_a) {
    var amountFunded = _a.amountFunded, setFundAmount = _a.setFundAmount, setShowFundPopup = _a.setShowFundPopup, saving = _a.saving, token = _a.token, campaignId = _a.campaignId, oldAmountFunded = _a.oldAmountFunded, onPaymentSuccess = _a.onPaymentSuccess;
    var _b = useState(false), loadingPayment = _b[0], setLoadingPayment = _b[1]; // State for payment button loading
    var _c = useState(false), loadingSave = _c[0], setLoadingSave = _c[1]; // State for save without fund button loading
    var router = useRouter(); // Initialize the useRouter hook
    var handlePaymentSuccess = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingPayment(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Update the campaign status to "Live" after successful payment
                    return [4 /*yield*/, updateCampaignStatus(Number(campaignId), "Live", token)];
                case 2:
                    // Update the campaign status to "Live" after successful payment
                    _a.sent();
                    onPaymentSuccess(); // Notify parent component
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to update campaign status after payment", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingPayment(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveWithoutFund = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingSave(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Optionally, update the campaign status to "Draft" or another status
                    return [4 /*yield*/, updateCampaignStatus(Number(campaignId), "Draft", token)];
                case 2:
                    // Optionally, update the campaign status to "Draft" or another status
                    _a.sent();
                    router.push("/brand/campaigns"); // Redirect to the campaigns page
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error("Failed to save campaign without funding", error_2);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingSave(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-medium text-left text-[#10ad1b]">
            4. Boost this Campaign
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Fund Amount</label>
              <input type="number" value={amountFunded} onChange={function (e) { return setFundAmount(Number(e.target.value)); }} className="px-4 py-2 border border-gray-300 rounded mb-4 w-full"/>
            </div>
          </div>
          <p className="text-xs text-left text-black/75">
            Left Campaign Budget: {oldAmountFunded}
          </p>
          <div className="flex justify-between gap-2">
            <button onClick={function () { return setShowFundPopup(false); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={saving || loadingSave || loadingPayment}>
              Cancel
            </button>
            <button onClick={handleSaveWithoutFund} className={"px-4 py-2 rounded ".concat(loadingSave ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600", " text-white flex justify-center items-center")} disabled={loadingSave || saving || loadingPayment}>
              {loadingSave ? <Spinner /> : "Save Without Fund"}
            </button>
            <StripeWrapper>
              <PaymentForm campaignId={Number(campaignId)} amountFunded={amountFunded || 0} oldAmount={oldAmountFunded || 0} disabled={saving || loadingSave} onSuccess={handlePaymentSuccess} // Pass handlePaymentSuccess as onSuccess
    />
            </StripeWrapper>
          </div>
        </div>
      </div>
    </div>);
};
export default FundCampaignModal;
