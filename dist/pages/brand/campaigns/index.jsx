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
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CalendarIcon from "../../../components/Icons/CalendarIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";
import EditIcon from "../../../components/Icons/EditIcon";
import QRCode from "qrcode.react";
import PaymentFormInline from "../../../components/campaign/PaymentFormInline";
import StripeWrapper from "../../../components/campaign/StripeWrapper";
import { deleteCampaign, updateCampaignStatus, createCampaign, fetchCampaigns, } from "../../../services/campaign/campaign";
import { useSession } from "../../../contexts/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import CampaignItemIconSmall from "../../../components/Icons/CampaignItemIconSmall";
import DoubleMoneyIcon from "../../../components/Icons/DoubleMoneyIcon";
import LiveStatusIcon from "@/components/Icons/LiveStatusIcon";
import EndedStatusIcon from "@/components/Icons/EndedStatusIcon";
import DraftStatusIcon from "@/components/Icons/DraftStatusIcon";
import PendingStatusIcon from "@/components/Icons/PendingStatusIcon";
var CampaignIndex = function () {
    var router = useRouter();
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var _b = useState([]), campaigns = _b[0], setCampaigns = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState(false), showDeletePopup = _e[0], setShowDeletePopup = _e[1];
    var _f = useState(null), deleteCampaignId = _f[0], setDeleteCampaignId = _f[1];
    var _g = useState(false), deleting = _g[0], setDeleting = _g[1];
    var _h = useState(null), showQRPopup = _h[0], setShowQRPopup = _h[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        var loadCampaigns = function () { return __awaiter(void 0, void 0, void 0, function () {
            var campaignsData, currentDate, _loop_1, _i, campaignsData_1, campaign, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && !loadExecutedRef.current)) return [3 /*break*/, 9];
                        setLoading(true);
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, 8, 9]);
                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                return fetchCampaigns(token);
                            })];
                    case 2:
                        campaignsData = _a.sent();
                        currentDate = new Date();
                        _loop_1 = function (campaign) {
                            var closeDate;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        closeDate = campaign.closeDate
                                            ? new Date(campaign.closeDate)
                                            : null;
                                        if (!(closeDate && closeDate < currentDate)) return [3 /*break*/, 3];
                                        if (!(campaign.amountFunded &&
                                            campaign.amountFunded <= 0 &&
                                            campaign.status !== "Ended")) return [3 /*break*/, 2];
                                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                                return updateCampaignStatus(campaign.id, "Ended", token);
                                            })];
                                    case 1:
                                        _b.sent();
                                        campaign.status = "Ended";
                                        _b.label = 2;
                                    case 2: return [3 /*break*/, 5];
                                    case 3:
                                        if (!(campaign.amountFunded &&
                                            campaign.amountFunded > 0 &&
                                            closeDate &&
                                            closeDate > currentDate &&
                                            campaign.status !== "Live")) return [3 /*break*/, 5];
                                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                                return updateCampaignStatus(campaign.id, "Live", token);
                                            })];
                                    case 4:
                                        _b.sent();
                                        campaign.status = "Live";
                                        _b.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, campaignsData_1 = campaignsData;
                        _a.label = 3;
                    case 3:
                        if (!(_i < campaignsData_1.length)) return [3 /*break*/, 6];
                        campaign = campaignsData_1[_i];
                        return [5 /*yield**/, _loop_1(campaign)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        setCampaigns(campaignsData);
                        return [3 /*break*/, 9];
                    case 7:
                        err_1 = _a.sent();
                        console.error("Error loading campaigns:", err_1);
                        return [3 /*break*/, 9];
                    case 8:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        loadCampaigns();
    }, [session, withTokenRefresh]);
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((session === null || session === void 0 ? void 0 : session.token) && deleteCampaignId !== null)) return [3 /*break*/, 4];
                    setDeleting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return deleteCampaign(deleteCampaignId, token);
                        })];
                case 2:
                    _a.sent();
                    setShowDeletePopup(false);
                    setDeleteCampaignId(null);
                    setDeleting(false);
                    // Reload the page
                    router.reload();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setDeleting(false);
                    console.error("Error deleting campaign:", err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateCampaign = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newCampaign_1, createdCampaign, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 4];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    newCampaign_1 = {
                        name: "New Campaign",
                        startDate: null,
                        closeDate: null,
                        company: null,
                        terms: null,
                        discountType: "FixedAmount",
                        discountValue: null,
                        appliesTo: null,
                        format: "Popup",
                        commission: null,
                        commissionType: "FixedAmount",
                        amountFunded: 0,
                    };
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return createCampaign(newCampaign_1, token);
                        })];
                case 2:
                    createdCampaign = _a.sent();
                    router.push("/brand/campaigns/edit?campaignId=".concat(createdCampaign.id));
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error("Error creating campaign:", err_3);
                    setError("Failed to create campaign. Please try again.");
                    setLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getStatusColor = function (status) {
        switch (status) {
            case "Pending":
                return "text-yellow-600";
            case "Draft":
                return "text-blue-600";
            case "Ended":
                return "text-red-600";
            case "Live":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case "Live":
                return <LiveStatusIcon />;
            case "Ended":
                return <EndedStatusIcon />;
            case "Draft":
                return <DraftStatusIcon />;
            case "Pending":
                return <PendingStatusIcon />;
            default:
                return null;
        }
    };
    var downloadQR = function (campaignId) {
        var canvas = document.getElementById("qr-".concat(campaignId));
        var pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        var downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "campaign-".concat(campaignId, ".png");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}
      {showDeletePopup && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg z-60">
            <p>Are you sure you want to delete this campaign?</p>
            <div className="flex justify-end mt-4">
              <button onClick={function () { return setShowDeletePopup(false); }} className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>)}
      {showQRPopup !== null && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg z-60 flex flex-col items-center">
            <QRCode id={"qr-".concat(showQRPopup)} value="https://example.com"/>
            <div className="flex justify-end mt-4 w-full">
              <button onClick={function () { return setShowQRPopup(null); }} className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Close
              </button>
              <button onClick={function () { return downloadQR(showQRPopup); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Download QR Code
              </button>
            </div>
          </div>
        </div>)}

      {error && <p className="text-red-600">{error}</p>}
      <button onClick={handleCreateCampaign} className="h-12 px-6 py-2 rounded-lg bg-[#47B775] text-white font-medium hover:bg-[#47B775] mb-8">
        Create Campaign
      </button>
      {campaigns.length > 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map(function (campaign) { return (<div key={campaign.id} className="relative flex flex-col items-start p-4 gap-2 w-full rounded-2xl bg-white shadow-lg overflow-hidden">
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-3">
                  <CampaignItemIconSmall />
                  <p className="text-xl font-medium text-gray-800">
                    {campaign.name || ""}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={function () {
                    return router.push("/brand/campaigns/edit?campaignId=".concat(campaign.id));
                }} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <EditIcon />
                  </button>
                  <button onClick={function () {
                    setDeleteCampaignId(campaign.id);
                    setShowDeletePopup(true);
                }} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center w-full">
                <div className="sm:h-[164px] md:h-fit"></div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                  <div className="flex justify-between w-full">
                    <p className="flex items-center gap-2">
                      <DoubleMoneyIcon />
                      Amount Available
                      <span className="font-bold">
                        ${campaign.amountFunded || "0"}
                      </span>
                    </p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(campaign.status)}
                      <p className={"".concat(getStatusColor(campaign.status))}>
                        Status:{" "}
                        <span className="font-bold">
                          {campaign.status || ""}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <p className="text-sm text-gray-600">
                      Created on{" "}
                      <span className="font-semibold">
                        {campaign.date_created
                    ? new Date(campaign.date_created).toLocaleDateString()
                    : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <p className="text-sm text-gray-600">
                      Start Date:{" "}
                      <span className="">
                        {campaign.startDate
                    ? new Date(campaign.startDate).toLocaleDateString()
                    : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <p className="text-sm text-gray-600">
                      Close Date:{" "}
                      <span className="">
                        {campaign.closeDate
                    ? new Date(campaign.closeDate).toLocaleDateString()
                    : ""}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full items-center mt-4">
                <StripeWrapper>
                  <PaymentFormInline campaign={campaign} loading={false}/>
                </StripeWrapper>

                <button className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-1.5 rounded bg-[#fef]" onClick={function () {
                    var _a;
                    return setShowQRPopup(showQRPopup === campaign.id ? null : (_a = campaign.id) !== null && _a !== void 0 ? _a : null);
                }}>
                  <span className="text-[#851087] font-semibold">QR Code</span>
                </button>
              </div>
            </div>); })}
        </div>)}
    </div>);
};
export var getStaticProps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                props: {
                    title: "Campaigns",
                },
            }];
    });
}); };
export default CampaignIndex;
