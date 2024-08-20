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
import { fetchCustomerByUUID, registerClick, } from "../../../services/referrals/referralTracking";
/**
 * Handles the referral logic including validation, registering clicks, and setting cookies.
 *
 * This function manages the process of checking whether a referral UUID is present either
 * in the request's URL or in the client's cookies. If a valid referral UUID is found,
 * it registers the click and sets a referral cookie if necessary. If any issues arise,
 * such as an invalid UUID, the function handles the error accordingly.
 *
 * @param {string | null} referralUuid - The referral UUID extracted from the URL, or null if not found.
 * @param {string | null} existingReferralCookie - The existing referral cookie value, or null if not found.
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse} res - The outgoing HTTP response object.
 * @param {string} BOT_TOKEN - The authentication token used to interact with the backend services.
 * @returns {Promise<boolean>} - Returns true if the referral was successfully handled, otherwise false.
 */
export function handleReferral(referralUuid, req, res, BOT_TOKEN) {
    return __awaiter(this, void 0, void 0, function () {
        var referralRecord, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!referralUuid) return [3 /*break*/, 7];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    console.log("Fetching referral record from DB...");
                    return [4 /*yield*/, fetchCustomerByUUID(referralUuid, BOT_TOKEN)];
                case 2:
                    referralRecord = _a.sent();
                    if (!referralRecord) {
                        console.log("Invalid referral code");
                        res.status(404).json({
                            success: false,
                            message: "Invalid referral code",
                        });
                        return [2 /*return*/, false];
                    }
                    console.log("Referral Record Found:", referralRecord);
                    console.log("Registering click...");
                    if (!(referralRecord.uuid !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, registerClick(referralRecord.uuid, BOT_TOKEN)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.error("Referral record UUID is undefined.");
                    _a.label = 5;
                case 5: return [2 /*return*/, true];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error handling referral:", error_1);
                    res.status(500).json({
                        success: false,
                        message: "Error processing referral",
                    });
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/, true];
            }
        });
    });
}
