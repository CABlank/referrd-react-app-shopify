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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
var API_URL = process.env.NEXT_PUBLIC_API_URL;
var BOT_TOKEN = process.env.BOT_TOKEN;
var CampaignPage = function () {
    var router = useRouter();
    var id = router.query.id; // Get the campaign ID from the URL
    var _a = useState(null), compiledHtml = _a[0], setCompiledHtml = _a[1]; // New state for compiled HTML
    var _b = useState(true), isLoading = _b[0], setIsLoading = _b[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, fetch("".concat(API_URL, "/items/campaign_public_page/").concat(id), {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer ".concat(BOT_TOKEN),
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch campaign data");
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        setCompiledHtml(JSON.parse(data.data.compiledHtml)); // Parse and set compiled HTML state
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error fetching campaign data:", error_1);
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [id]); // Fetch data when the ID changes
    useEffect(function () {
        if (compiledHtml) {
            var renderContent_1 = function () {
                var contentDiv = document.getElementById("content");
                if (!contentDiv)
                    return;
                var isMobile = window.innerWidth <= 768;
                contentDiv.innerHTML = "";
                if (isMobile) {
                    contentDiv.innerHTML = "\n            <h2>Compiled HTML - Mobile Step One:</h2>\n            <div>".concat(compiledHtml.mobileStepOne, "</div>\n            <h2>Compiled HTML - Mobile Step Two:</h2>\n            <div>").concat(compiledHtml.mobileStepTwo, "</div>\n          ");
                }
                else {
                    contentDiv.innerHTML = "\n            <h2>Compiled HTML - Desktop Step One:</h2>\n            <div>".concat(compiledHtml.desktopStepOne, "</div>\n            <h2>Compiled HTML - Desktop Step Two:</h2>\n            <div>").concat(compiledHtml.desktopStepTwo, "</div>\n          ");
                }
            };
            renderContent_1();
            // Add event listener for screen resize
            window.addEventListener("resize", renderContent_1);
            // Cleanup event listener on component unmount
            return function () {
                window.removeEventListener("resize", renderContent_1);
            };
        }
    }, [compiledHtml]);
    if (isLoading) {
        return null;
    }
    return <div id="content"></div>;
};
CampaignPage.noLayout = true; // Set the custom property
export default CampaignPage;
