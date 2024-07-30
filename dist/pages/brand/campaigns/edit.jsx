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
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import CampaignDetail from "../../../components/campaign/CampaignDetail";
import ReferralDetail from "../../../components/campaign/ReferralDetail";
import DiscountValue from "../../../components/campaign/DiscountValue";
import BarBuilder from "../../../components/campaign/BarBuilder/MainBarBuilder/BarBuilder";
import PopupBuilder from "../../../components/campaign/PopupBuilder/MainPopupBuilder/PopupBuilder";
import CampaignCreativeSelector from "../../../components/campaign/CampaignCreativeSelector";
import ArrowDropdownIcon from "../../../components/Icons/ArrowDropdownIcon";
import { fetchCampaign, updateCampaign, } from "../../../services/campaign/campaign";
import { useSession } from "../../../contexts/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DesktopCreativeHide from "@/components/campaign/DesktopCreativeHide";
import StripeWrapper from "../../../components/campaign/StripeWrapper";
import PaymentForm from "../../../components/campaign/PaymentForm";
var useIsDesktop = function () {
    var _a = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : false), isDesktop = _a[0], setIsDesktop = _a[1];
    useEffect(function () {
        var handleResize = function () { return setIsDesktop(window.innerWidth >= 1024); };
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
    }, []);
    return isDesktop;
};
var EditCampaign = function () {
    var _a = useSession(), session = _a.session, sessionLoading = _a.loading, withTokenRefresh = _a.withTokenRefresh;
    var router = useRouter();
    var campaignId = router.query.campaignId;
    var _b = useState(true), isOpen = _b[0], setIsOpen = _b[1];
    var _c = useState(null), campaignData = _c[0], setCampaignData = _c[1];
    var _d = useState(true), loading = _d[0], setLoading = _d[1];
    var _e = useState(false), saving = _e[0], setSaving = _e[1]; // Added state to track saving status
    var _f = useState(null), error = _f[0], setError = _f[1];
    var loadExecutedRef = useRef(false);
    var barBuilderRef = useRef(null);
    var popupBuilderRef = useRef(null);
    var isDesktop = useIsDesktop();
    var _g = useState(false), showFundPopup = _g[0], setShowFundPopup = _g[1];
    var _h = useState(10000), amountFunded = _h[0], setFundAmount = _h[1]; // Default fund amount
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && campaignId && !loadExecutedRef.current)) return [3 /*break*/, 5];
                        setLoading(true);
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                return fetchCampaign(Number(campaignId), token);
                            })];
                    case 2:
                        data = _a.sent();
                        setCampaignData(__assign(__assign({}, data), { startDate: data.startDate
                                ? new Date(data.startDate).toISOString().split("T")[0]
                                : "", closeDate: data.closeDate
                                ? new Date(data.closeDate).toISOString().split("T")[0]
                                : "", company: data.company || "" }));
                        // Deserialize state if available
                        if (data.serializedTopbarState &&
                            data.settingsTopbarState &&
                            barBuilderRef.current) {
                            barBuilderRef.current.deserializeRealTopBar(JSON.parse(data.serializedTopbarState));
                            barBuilderRef.current.deserializeTopbarSettings(JSON.parse(data.settingsTopbarState));
                        }
                        if (data.serializedPopupState &&
                            data.settingsPopupState &&
                            popupBuilderRef.current) {
                            popupBuilderRef.current.deserializeRealPopUp(JSON.parse(data.serializedPopupState));
                            popupBuilderRef.current.deserializePopupSettings(JSON.parse(data.settingsPopupState));
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to fetch campaign data", error_1);
                        setError("Failed to fetch campaign data. Please try again.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        if (!sessionLoading) {
            fetchData();
        }
    }, [session, campaignId, sessionLoading, withTokenRefresh]);
    var handleToggle = function () {
        setIsOpen(!isOpen);
    };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        if (campaignData) {
            setCampaignData(function (prevData) {
                var _a;
                return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
            });
        }
    };
    var handleFormatSelect = function (format) {
        if (campaignData && (format === "Popup" || format === "Topbar")) {
            setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { format: format })); });
        }
    };
    var handleSaveChanges = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var serializedTopbarState, settingsTopbarState, serializedPopupState, settingsPopupState, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setSaving(true); // Indicate that saving is in progress
                    if (!campaignData) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 3];
                    if (barBuilderRef.current) {
                        serializedTopbarState = barBuilderRef.current.serializeRealTopBar();
                        settingsTopbarState = barBuilderRef.current.serializeTopbarSettings();
                        campaignData.serializedTopbarState = JSON.stringify(serializedTopbarState);
                        campaignData.settingsTopbarState =
                            JSON.stringify(settingsTopbarState);
                    }
                    if (popupBuilderRef.current) {
                        serializedPopupState = popupBuilderRef.current.serializeRealPopUp();
                        settingsPopupState = popupBuilderRef.current.serializePopupSettings();
                        campaignData.serializedPopupState =
                            JSON.stringify(serializedPopupState);
                        campaignData.settingsPopupState =
                            JSON.stringify(settingsPopupState);
                    }
                    console.log("Campaign data before save:", campaignData);
                    return [4 /*yield*/, withTokenRefresh(function (token) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, updateCampaign(campaignData, token)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    // Show the funding popup after saving changes
                    setShowFundPopup(true);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error("Failed to save data", error_2);
                    setError("Failed to save data. Please communicate with support.");
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    setSaving(false); // Indicate that saving is complete
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return <LoadingOverlay />;
    }
    if (!campaignData) {
        return <div>{error || "Loading..."}</div>;
    }
    // Ensure that the URL is always a string before passing it to the components
    var campaignDataWithNonNullableUrl = __assign(__assign({}, campaignData), { url: campaignData.url || "", startDate: campaignData.startDate || "", closeDate: campaignData.closeDate || "", company: campaignData.company || "" });
    return (<div className={"relative ".concat(loading ? "blur-sm" : "", " flex-1 overflow-y-auto overflow-x-hidden")}>
      {loading && <LoadingOverlay />}
      <main className="">
        <div className="max-w-7xl mx-auto mb-10 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center relative gap-2">
              <Link href="/brand/campaigns" className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50">
                Campaigns
              </Link>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-4 h-4 relative" preserveAspectRatio="xMidYMid meet">
                <path d="M5.75 3.5L10.25 8L5.75 12.5" stroke="black" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50">
                Edit Campaign
              </p>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-[#47B775] text-white rounded-md" onClick={handleSaveChanges} disabled={saving} // Disable save button if saving is in progress
    >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600">{error}</div>}
          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={handleToggle}>
              <h2 className="text-xl font-semibold text-[#47B775]">
                Campaign Information
              </h2>
              <button className="focus:outline-none">
                <ArrowDropdownIcon isOpen={isOpen}/>
              </button>
            </div>
            <hr className="border-gray-200 mb-6"/>
            {isOpen ? (<div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <CampaignDetail campaign={campaignDataWithNonNullableUrl} handleChange={handleChange} className="bg-white p-0 border-0 shadow-none"/>
                </div>
                <div className="w-full md:w-[1px] bg-gray-200"/>
                <div className="flex-1">
                  <ReferralDetail campaign={campaignDataWithNonNullableUrl} handleChange={handleChange} className="bg-white p-0 border-0 shadow-none"/>
                </div>
                <div className="w-full md:w-[1px] bg-gray-200"/>
                <div className="flex-1">
                  <DiscountValue discount={{
                type: campaignData.discountType,
                value: campaignData.discountValue,
                appliesTo: campaignData.appliesTo,
            }} handleChange={handleChange} className="bg-white p-0 border-0 shadow-none"/>
                </div>
              </div>) : (<div className="text-sm text-gray-500 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="mr-0 md:mr-10">
                    <strong>Campaign ID:</strong> {campaignData.id}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Name:</strong> {campaignData.name}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Start Date:</strong> {campaignData.startDate}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Close Date:</strong> {campaignData.closeDate}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Company:</strong> {campaignData.company}
                  </p>
                </div>
                <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0"/>
                <div className="flex-1">
                  <p className="mr-0 md:mr-10">
                    <strong>Commission Type:</strong>{" "}
                    {campaignData.commissionType}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Commission:</strong> {campaignData.commission}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Campaign Terms:</strong> {campaignData.terms}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Campaign URL:</strong> {campaignData.url}
                  </p>
                </div>
                <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0"/>
                <div className="flex-1">
                  <p className="mr-0 md:mr-10">
                    <strong>Discount Type:</strong> {campaignData.discountType}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Discount Value:</strong>{" "}
                    {campaignData.discountValue}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Applies To:</strong> {campaignData.appliesTo}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
        {isDesktop ? (<>
            <CampaignCreativeSelector className="w-full mb-10 bg-white shadow rounded-lg border border-gray-200" selectedFormat={campaignData.format} onSelect={handleFormatSelect}/>
            {campaignData.format === "Topbar" ? (<BarBuilder ref={barBuilderRef} campaign={campaignDataWithNonNullableUrl} className="w-full bg-white shadow rounded-lg border border-gray-200"/>) : (<PopupBuilder ref={popupBuilderRef} campaign={campaignDataWithNonNullableUrl} className="w-full bg-white shadow rounded-lg border border-gray-200"/>)}
          </>) : (<DesktopCreativeHide />)}
        {showFundPopup && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                  Left Campaign Budget: {campaignData.amountFunded}
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={function () { return setShowFundPopup(false); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={saving}>
                    Cancel
                  </button>
                  <StripeWrapper>
                    <PaymentForm campaignId={Number(campaignId)} amountFunded={amountFunded || 0} oldAmount={campaignData.amountFunded || 0} disabled={saving}/>
                  </StripeWrapper>
                </div>
              </div>
            </div>
          </div>)}
      </main>
    </div>);
};
export var getStaticProps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                props: {
                    title: "Edit Campaign",
                },
            }];
    });
}); };
export default EditCampaign;
