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
import { updateCampaignStatus } from "../../services/campaign/campaign";
import Spinner from "../common/Spinner";
import ArrowDropdownIcon from "../Icons/ArrowDropdownIcon";
var CampaignStatusSelector = function (_a) {
    var campaignId = _a.campaignId, token = _a.token, currentStatus = _a.currentStatus;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(currentStatus), selectedStatus = _c[0], setSelectedStatus = _c[1];
    var _d = useState(currentStatus), pendingStatus = _d[0], setPendingStatus = _d[1];
    var _e = useState(false), isDropdownOpen = _e[0], setIsDropdownOpen = _e[1];
    var handleStatusChange = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pendingStatus === selectedStatus)
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, updateCampaignStatus(campaignId, pendingStatus, token)];
                case 2:
                    _a.sent();
                    setSelectedStatus(pendingStatus);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to update campaign status", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDropdownToggle = function () {
        setIsDropdownOpen(function (prev) { return !prev; });
    };
    // Define classes based on the selected status
    var statusColors = {
        Draft: {
            border: "border-blue-500",
            button: "bg-blue-500 hover:bg-blue-600",
        },
        Live: {
            border: "border-green-500",
            button: "bg-green-500 hover:bg-green-600",
        },
        Ended: {
            border: "border-red-500",
            button: "bg-red-500 hover:bg-red-600",
        },
    };
    return (<div className="relative items-center p-6 bg-white rounded-lg shadow-md w-full my-12">
      <h2 className="flex text-xl font-semibold text-green-500 text-center mb-4 self-start">
        6. Campaign Status
      </h2>
      <hr className="border-gray-200 mb-6"/>
      <p className="text-center text-gray-600 mb-6">
        Select the current status of your campaign.
      </p>

      {loading && (<div className="absolute inset-0 flex justify-center items-center bg-gray-300 bg-opacity-50 z-50">
          <Spinner />
        </div>)}

      <div className={"".concat(loading ? "blur-sm" : "", " relative flex flex-col items-center")}>
        <div className="relative inline-block w-full max-w-md">
          <select value={pendingStatus} onChange={function (e) {
            return setPendingStatus(e.target.value);
        }} onClick={handleDropdownToggle} className={"w-full px-4 py-2 pr-10 bg-white ".concat(statusColors[pendingStatus].border, " border rounded-lg shadow-sm appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-").concat(pendingStatus.toLowerCase(), "-500 focus:border-transparent")} disabled={loading}>
            <option value="Draft">Draft</option>
            <option value="Live">Live</option>
            <option value="Ended">Ended</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ArrowDropdownIcon isOpen={isDropdownOpen}/>
          </div>
        </div>

        <button onClick={handleStatusChange} className={"px-4 py-2 mt-4 ".concat(pendingStatus !== selectedStatus
            ? statusColors[pendingStatus].button
            : "bg-gray-300", " text-white rounded-lg transition-colors duration-300")} disabled={pendingStatus === selectedStatus || loading}>
          {loading ? "Saving..." : "Confirm Status Change"}
        </button>
      </div>
    </div>);
};
export default CampaignStatusSelector;
