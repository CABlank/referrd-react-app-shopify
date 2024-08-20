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
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import BarBuilder from "../../../components/campaign/BarBuilder/MainBarBuilder/BarBuilder";
import PopupBuilder from "../../../components/campaign/PopupBuilder/MainPopupBuilder/PopupBuilder";
import CampaignCreativeSelector from "../../../components/campaign/CampaignCreativeSelector";
import { fetchCampaign, updateCampaign, } from "../../../services/campaign/campaign";
import { fetchCompanyUrl } from "../../../services/company/company";
import { useSession } from "../../../context/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import Spinner from "../../../components/common/Spinner"; // Import the Spinner component
import DesktopCreativeHide from "@/components/campaign/DesktopCreativeHide";
import sessionLoadCheckerUtil from "../../../utils/middleware/sessionLoadCheckerUtil";
import FundCampaignModal from "../../../components/campaign/FundCampaignModal";
import CampaignInformation from "../../../components/campaign/CampaignInformation"; // Import the new component
import CampaignHeader from "../../../components/campaign/CampaignHeader"; // Import the new CampaignHeader component
import CampaignPayment from "../../../components/campaign/CampaignPayment";
import PushCampaignLive from "../../../components/campaign/PushCampaignLive";
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
    var _a, _b;
    var _c = useSession(), session = _c.session, sessionLoading = _c.loading, withTokenRefresh = _c.withTokenRefresh;
    var router = useRouter();
    var campaignId = router.query.campaignId;
    var _d = useState(true), isOpen = _d[0], setIsOpen = _d[1];
    var _e = useState(null), campaignData = _e[0], setCampaignData = _e[1];
    var _f = useState(null), companyUrl = _f[0], setCompanyUrl = _f[1]; // Add state for company URL
    var _g = useState(true), loading = _g[0], setLoading = _g[1];
    var _h = useState(false), saving = _h[0], setSaving = _h[1]; // Added state to track saving status
    var _j = useState(null), error = _j[0], setError = _j[1];
    var loadExecutedRef = useRef(false);
    var barBuilderRef = useRef(null);
    var popupBuilderRef = useRef(null);
    var isDesktop = useIsDesktop();
    var _k = useState(false), showFundPopup = _k[0], setShowFundPopup = _k[1];
    var _l = useState(1000), amountFunded = _l[0], setFundAmount = _l[1]; // Default fund amount
    var _m = useState(false), paymentConfirmed = _m[0], setPaymentConfirmed = _m[1]; // Track payment confirmation
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, url, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && campaignId && !loadExecutedRef.current)) return [3 /*break*/, 6];
                        setLoading(true);
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                return fetchCampaign(Number(campaignId), token);
                            })];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, withTokenRefresh(function (token) { return fetchCompanyUrl(token); })];
                    case 3:
                        url = _a.sent();
                        setCompanyUrl(url);
                        setCampaignData(__assign(__assign({}, data), { startDate: data.startDate
                                ? new Date(data.startDate).toISOString().split("T")[0]
                                : "", closeDate: data.closeDate
                                ? new Date(data.closeDate).toISOString().split("T")[0]
                                : "", company: url }));
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
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Failed to fetch campaign data", error_1);
                        setError("Failed to fetch campaign data. Please try again.");
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
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
    var handlePaymentSuccess = function () {
        // Handle post-payment success, e.g., redirect or show a success message
        router.push("/brand/campaigns/edit?campaignId=".concat(campaignId));
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
        var serializedTopbarState, settingsTopbarState, compiledHtml, serializedPopupState, settingsPopupState, compiledHtml, error_2;
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
                        compiledHtml = barBuilderRef.current.getCompiledHtml();
                        campaignData.compiledHtml = JSON.stringify(compiledHtml); // Update this to save compiledHtml from BarBuilder
                    }
                    if (popupBuilderRef.current) {
                        serializedPopupState = popupBuilderRef.current.serializeRealPopUp();
                        settingsPopupState = popupBuilderRef.current.serializePopupSettings();
                        campaignData.serializedPopupState =
                            JSON.stringify(serializedPopupState);
                        campaignData.settingsPopupState =
                            JSON.stringify(settingsPopupState);
                        compiledHtml = popupBuilderRef.current.getCompiledHtml();
                        campaignData.compiledHtml = JSON.stringify(compiledHtml); // If you're storing compiled HTML for Popup separately
                    }
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
    if (loading || saving) {
        return (<div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>);
    }
    if (!campaignData) {
        return <div>{error || "Loading..."}</div>;
    }
    // Ensure that the URL is always a string before passing it to the components
    var campaignDataWithNonNullableUrl = __assign(__assign({}, campaignData), { url: campaignData.company || "", startDate: campaignData.startDate || "", closeDate: campaignData.closeDate || "", company: campaignData.company || "" });
    return (<div className={"relative ".concat(loading || saving ? "blur-sm" : "", " flex-1 overflow-y-auto overflow-x-hidden")}>
      {loading && <LoadingOverlay />}
      <main className="">
        <div className="max-w mx-auto mb-10 space-y-6">
          {/* Use the new CampaignHeader component */}
          <CampaignHeader saving={saving} handleSaveChanges={handleSaveChanges}/>

          {error && <div className="text-red-600">{error}</div>}

          {/* Use the new CampaignInformation component */}
          <CampaignInformation isOpen={isOpen} handleToggle={handleToggle} campaignData={campaignDataWithNonNullableUrl} handleChange={handleChange}/>
        </div>
        {isDesktop ? (<>
            <CampaignCreativeSelector className="w-full mb-10 bg-white shadow rounded-lg border border-gray-200" selectedFormat={campaignData.format} onSelect={handleFormatSelect}>
              {campaignData.format === "Topbar" ? (<BarBuilder ref={barBuilderRef} campaign={campaignDataWithNonNullableUrl} className="w-full bg-white shadow rounded-lg border border-gray-200"/>) : (<PopupBuilder ref={popupBuilderRef} campaign={campaignDataWithNonNullableUrl} className="w-full bg-white shadow rounded-lg border border-gray-200"/>)}
            </CampaignCreativeSelector>
          </>) : (<DesktopCreativeHide />)}
        {showFundPopup && (<FundCampaignModal token={(_a = session === null || session === void 0 ? void 0 : session.token) !== null && _a !== void 0 ? _a : ""} amountFunded={amountFunded} setFundAmount={setFundAmount} setShowFundPopup={setShowFundPopup} saving={saving} campaignId={campaignId} oldAmountFunded={campaignData.amountFunded || 0} onPaymentSuccess={handlePaymentSuccess} // Pass the success handler here
        />)}

        <CampaignPayment campaignId={Number(campaignId)} token={(_b = session === null || session === void 0 ? void 0 : session.token) !== null && _b !== void 0 ? _b : ""} onPaymentSuccess={handlePaymentSuccess} // Pass the success handler here
    />

        <PushCampaignLive campaignId={campaignData.id} token={session === null || session === void 0 ? void 0 : session.token} currentStatus={campaignData.status}/>
      </main>
    </div>);
};
export var getServerSideProps = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sessionLoadCheckerUtil(context)];
            case 1:
                result = _a.sent();
                if ("redirect" in result || "notFound" in result) {
                    return [2 /*return*/, result];
                }
                if (!("props" in result)) {
                    return [2 /*return*/, {
                            props: {
                                title: "Edit Campaign",
                            },
                        }];
                }
                return [2 /*return*/, {
                        props: __assign(__assign({}, result.props), { title: "Edit Campaign" }),
                    }];
        }
    });
}); };
export default EditCampaign;
