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
import Spinner from "../../../components/common/Spinner";
import DesktopCreativeHide from "@/components/campaign/DesktopCreativeHide";
import initialLoadChecker from "../../../utils/middleware/initialLoadChecker";
import FundCampaignModal from "../../../components/campaign/FundCampaignModal";
import CampaignInformation from "../../../components/campaign/CampaignInformation";
import CampaignHeader from "../../../components/campaign/CampaignHeader";
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
var EditCampaign = function (_a) {
    var _b, _c;
    var accessToken = _a.accessToken, refreshToken = _a.refreshToken, userId = _a.userId;
    var _d = useSession(), session = _d.session, sessionLoading = _d.loading, withTokenRefresh = _d.withTokenRefresh;
    var router = useRouter();
    var campaignId = router.query.campaignId;
    var _e = useState(true), isOpen = _e[0], setIsOpen = _e[1];
    var _f = useState(null), campaignData = _f[0], setCampaignData = _f[1];
    var _g = useState(null), companyUrl = _g[0], setCompanyUrl = _g[1];
    var _h = useState(true), loading = _h[0], setLoading = _h[1];
    var _j = useState(false), saving = _j[0], setSaving = _j[1];
    var _k = useState(null), error = _k[0], setError = _k[1];
    var loadExecutedRef = useRef(false);
    var barBuilderRef = useRef(null);
    var popupBuilderRef = useRef(null);
    var isDesktop = useIsDesktop();
    var _l = useState(false), showFundPopup = _l[0], setShowFundPopup = _l[1];
    var _m = useState(1000), amountFunded = _m[0], setFundAmount = _m[1];
    var _o = useState(false), paymentConfirmed = _o[0], setPaymentConfirmed = _o[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, url, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(((session === null || session === void 0 ? void 0 : session.token) || accessToken) &&
                            campaignId &&
                            !loadExecutedRef.current)) return [3 /*break*/, 6];
                        setLoading(true);
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, withTokenRefresh(function (token) { return fetchCampaign(Number(campaignId), token); }, refreshToken)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, withTokenRefresh(function (token) { return fetchCompanyUrl(token); }, refreshToken)];
                    case 3:
                        url = _a.sent();
                        setCompanyUrl(url);
                        setCampaignData(__assign(__assign({}, data), { startDate: data.startDate
                                ? new Date(data.startDate).toISOString().split("T")[0]
                                : "", closeDate: data.closeDate
                                ? new Date(data.closeDate).toISOString().split("T")[0]
                                : "", company: url }));
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
    }, [
        session,
        accessToken,
        refreshToken,
        campaignId,
        sessionLoading,
        withTokenRefresh,
    ]);
    var handleToggle = function () {
        setIsOpen(!isOpen);
    };
    var handlePaymentSuccess = function () {
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
                    setSaving(true);
                    if (!campaignData) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    if (!((session === null || session === void 0 ? void 0 : session.token) || accessToken)) return [3 /*break*/, 3];
                    if (barBuilderRef.current) {
                        serializedTopbarState = barBuilderRef.current.serializeRealTopBar();
                        settingsTopbarState = barBuilderRef.current.serializeTopbarSettings();
                        campaignData.serializedTopbarState = JSON.stringify(serializedTopbarState);
                        campaignData.settingsTopbarState =
                            JSON.stringify(settingsTopbarState);
                        compiledHtml = barBuilderRef.current.getCompiledHtml();
                        campaignData.compiledHtml = JSON.stringify(compiledHtml);
                    }
                    if (popupBuilderRef.current) {
                        serializedPopupState = popupBuilderRef.current.serializeRealPopUp();
                        settingsPopupState = popupBuilderRef.current.serializePopupSettings();
                        campaignData.serializedPopupState =
                            JSON.stringify(serializedPopupState);
                        campaignData.settingsPopupState =
                            JSON.stringify(settingsPopupState);
                        compiledHtml = popupBuilderRef.current.getCompiledHtml();
                        campaignData.compiledHtml = JSON.stringify(compiledHtml);
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
                        }); }, refreshToken)];
                case 2:
                    _a.sent();
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
                    setSaving(false);
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
    var campaignDataWithNonNullableUrl = __assign(__assign({}, campaignData), { url: campaignData.company || "", startDate: campaignData.startDate || "", closeDate: campaignData.closeDate || "", company: campaignData.company || "" });
    return (<div className={"relative ".concat(loading || saving ? "blur-sm" : "", " flex-1 overflow-y-auto overflow-x-hidden")}>
      {loading && <LoadingOverlay />}
      <main className="">
        <div className="max-w mx-auto mb-10 space-y-6">
          <CampaignHeader saving={saving} handleSaveChanges={handleSaveChanges}/>

          {error && <div className="text-red-600">{error}</div>}

          <CampaignInformation isOpen={isOpen} handleToggle={handleToggle} campaignData={campaignDataWithNonNullableUrl} handleChange={handleChange}/>
        </div>
        {isDesktop ? (<>
            <CampaignCreativeSelector className="w-full mb-10 bg-white shadow rounded-lg border border-gray-200" selectedFormat={campaignData.format} onSelect={handleFormatSelect}>
              {campaignData.format === "Topbar" ? (<BarBuilder ref={barBuilderRef} campaign={campaignDataWithNonNullableUrl} className="w-full bg-white shadow rounded-lg border border-gray-200"/>) : (<PopupBuilder ref={popupBuilderRef} campaign={campaignDataWithNonNullableUrl} className="w-full bg-white shadow rounded-lg border border-gray-200"/>)}
            </CampaignCreativeSelector>
          </>) : (<DesktopCreativeHide />)}
        {showFundPopup && (<FundCampaignModal token={(_b = session === null || session === void 0 ? void 0 : session.token) !== null && _b !== void 0 ? _b : ""} amountFunded={amountFunded} setFundAmount={setFundAmount} setShowFundPopup={setShowFundPopup} saving={saving} campaignId={campaignId} oldAmountFunded={campaignData.amountFunded || 0} onPaymentSuccess={handlePaymentSuccess}/>)}

        <CampaignPayment campaignId={Number(campaignId)} token={(_c = session === null || session === void 0 ? void 0 : session.token) !== null && _c !== void 0 ? _c : ""} onPaymentSuccess={handlePaymentSuccess}/>

        <PushCampaignLive campaignId={campaignData.id} token={session === null || session === void 0 ? void 0 : session.token} currentStatus={campaignData.status}/>
      </main>
    </div>);
};
export var getServerSideProps = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initialLoadChecker(context)];
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
