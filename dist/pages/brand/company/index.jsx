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
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CalendarIcon from "../../../components/Icons/CalendarIcon";
import EditIcon from "../../../components/Icons/EditIcon";
import LinkIcon from "../../../components/Icons/LinkIcon";
import FallbackLogo from "../../../components/Icons/FallbackLogo";
import Image from "next/image";
import { fetchCompaniesWithLogo, createCompany, uploadFile, } from "../../../services/company/company";
import { useSession } from "../../../context/SessionContext";
// Spinner component for loading state
var Spinner = function () { return (<div className="flex justify-center items-center h-full">
    <div className="loader"></div>
  </div>); };
// URL validation function to ensure the entered URL is valid
var validateUrl = function (url) {
    var urlPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return urlPattern.test(url);
};
// FetchCompanyData component for fetching and registering new company data
var FetchCompanyData = function (_a) {
    var setNeedsReload = _a.setNeedsReload;
    var router = useRouter();
    var _b = useSession(), session = _b.session, withTokenRefresh = _b.withTokenRefresh;
    var _c = useState(""), url = _c[0], setUrl = _c[1];
    var _d = useState({
        name: "",
        domain: "",
        logo: null,
        date_created: "",
        UUID: "", // Add a value for the UUID property
    }), company = _d[0], setCompany = _d[1];
    var _e = useState(null), logoPreview = _e[0], setLogoPreview = _e[1];
    var _f = useState(null), logoFile = _f[0], setLogoFile = _f[1];
    var _g = useState(false), loading = _g[0], setLoading = _g[1];
    var _h = useState(null), error = _h[0], setError = _h[1];
    var _j = useState(null), logoError = _j[0], setLogoError = _j[1];
    var _k = useState(false), isEditingName = _k[0], setIsEditingName = _k[1];
    var _l = useState(false), isEditingLogo = _l[0], setIsEditingLogo = _l[1];
    // Fetch company data from the provided URL
    var handleFetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a, name_1, logo, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!validateUrl(url)) {
                        setError("Invalid URL. Please enter a valid website URL.");
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/fetch?url=".concat(encodeURIComponent(url)))];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    _a = _b.sent(), name_1 = _a.name, logo = _a.logo;
                    setCompany(function (prevCompany) { return (__assign(__assign({}, prevCompany), { name: name_1 || "", domain: url })); });
                    setLogoPreview(logo ? logo.replace("http://", "https://") : "");
                    setLogoFile(null); // Reset file input if URL fetching is successful
                    if (!name_1 && !logo) {
                        setError("No recognizable data found at the provided URL. Please upload the logo manually.");
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _b.sent();
                    setError("Failed to fetch data. Please check the URL and try again.");
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Handle file input change for the company logo
    var handleFileChange = function (event) {
        if (event.target.files && event.target.files[0]) {
            var file = event.target.files[0];
            var objectUrl = URL.createObjectURL(file);
            setLogoFile(file);
            setLogoPreview(objectUrl); // Reset URL if file is selected
        }
    };
    // Enable editing the company name
    var handleEditName = function () {
        setIsEditingName(true);
    };
    // Enable editing the company logo
    var handleEditLogo = function () {
        setIsEditingLogo(true);
    };
    // Handle input changes for the company object
    var handleChange = function (field, value) {
        setCompany(function (prevCompany) {
            var _a;
            return (__assign(__assign({}, prevCompany), (_a = {}, _a[field] = value, _a)));
        });
    };
    // Handle saving the company data
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var logoId, uploadedLogo, response, blob, file_1, uploadedLogo, updatedCompany_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!logoPreview && !logoFile) {
                        setLogoError("Logo is required. Please upload a logo.");
                        return [2 /*return*/];
                    }
                    setIsEditingName(false);
                    setIsEditingLogo(false);
                    setLoading(true);
                    setError(null); // Clear any previous error
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, 11, 12]);
                    logoId = company.logo;
                    if (!logoFile) return [3 /*break*/, 3];
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return uploadFile(logoFile, token);
                        })];
                case 2:
                    uploadedLogo = _a.sent();
                    logoId = uploadedLogo; // Use the ID from the uploadFile response
                    return [3 /*break*/, 7];
                case 3:
                    if (!logoPreview) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetch(logoPreview)];
                case 4:
                    response = _a.sent();
                    return [4 /*yield*/, response.blob()];
                case 5:
                    blob = _a.sent();
                    file_1 = new File([blob], "logo.jpg", { type: "image/jpeg" });
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return uploadFile(file_1, token);
                        })];
                case 6:
                    uploadedLogo = _a.sent();
                    logoId = uploadedLogo; // Use the ID from the uploadFile response
                    _a.label = 7;
                case 7:
                    updatedCompany_1 = __assign(__assign({}, company), { logo: logoId });
                    if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 9];
                    return [4 /*yield*/, withTokenRefresh(function (token) { return createCompany(updatedCompany_1, token); })];
                case 8:
                    _a.sent();
                    setNeedsReload(true); // Trigger component reload
                    _a.label = 9;
                case 9: return [3 /*break*/, 12];
                case 10:
                    err_2 = _a.sent();
                    console.error("Error saving company:", err_2);
                    setError("Failed to save company. Please fill all fields.");
                    return [3 /*break*/, 12];
                case 11:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="">
      <h2 className="text-2xl mb-4">Register Company Data</h2>
      <div className="flex">
        <div id="websiteProtocolTxt" className="p-2 border border-gray-300 rounded-l-lg bg-gray-100">
          <p>https://</p>
        </div>
        <input name="businessWebsiteTxt" type="text" value={url} onChange={function (e) { return setUrl(e.target.value); }} placeholder="Business Website" maxLength={50} className="p-2 border border-gray-300 rounded-r-lg w-full"/>
      </div>
      <button onClick={handleFetchData} className="bg-blue-500 text-white p-2 rounded mt-4" disabled={loading}>
        {loading ? "Fetching..." : "Fetch Data"}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {company.name && (<div className="mt-4">
          <h3 className="text-xl font-medium">Fetched Data:</h3>
          <div className="flex items-center">
            {isEditingName ? (<input type="text" value={company.name} onChange={function (e) { return handleChange("name", e.target.value); }} className="border border-gray-300 rounded p-2"/>) : (<p>
                <strong>Company Name:</strong> {company.name}
              </p>)}
            <button onClick={handleEditName} className="ml-2">
              <EditIcon />
            </button>
          </div>
          <div className="flex items-center mt-2">
            <strong>Company Logo:</strong>
            {isEditingLogo ? (<div className="ml-2">
                <input type="file" accept="image/*" onChange={handleFileChange}/>
                {logoPreview && (<img src={logoPreview} alt="Company Logo" className="w-24 h-24 mt-2 object-contain"/>)}
              </div>) : (<>
                {logoPreview ? (<img src={logoPreview} alt="Company Logo" className="w-24 h-24 ml-2 object-contain"/>) : (<p className="ml-2">No logo found. Please upload a logo.</p>)}
                <button onClick={handleEditLogo} className="ml-2">
                  <EditIcon />
                </button>
              </>)}
          </div>
          {logoError && <p className="text-red-600 mt-2">{logoError}</p>}
          <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded mt-4">
            Save
          </button>
        </div>)}
    </div>);
};
// Main component for displaying and managing companies
var CompanyIndex = function () {
    var router = useRouter();
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var _b = useState([]), companies = _b[0], setCompanies = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState(true), needsReload = _e[0], setNeedsReload = _e[1];
    var loadExecutedRef = useRef(false);
    // Fetch companies when the component mounts or when needsReload changes
    useEffect(function () {
        var loadCompanies = function () { return __awaiter(void 0, void 0, void 0, function () {
            var companiesData, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && needsReload)) return [3 /*break*/, 5];
                        setLoading(true);
                        loadExecutedRef.current = true;
                        setNeedsReload(false); // Reset reload flag
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                return fetchCompaniesWithLogo(token);
                            })];
                    case 2:
                        companiesData = _a.sent();
                        setCompanies(companiesData);
                        return [3 /*break*/, 5];
                    case 3:
                        err_3 = _a.sent();
                        console.error("Error fetching companies:", err_3);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadCompanies();
    }, [session, withTokenRefresh, needsReload]);
    return (<div className="flex flex-col justify-start items-center max-w-full mx-auto gap-8 p-4">
      {loading ? (<Spinner />) : (<>
          {error && <p className="text-red-600">{error}</p>}
          {companies.length === 0 ? (
            // Show the form to register a new company if no companies exist
            <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
              <FetchCompanyData setNeedsReload={setNeedsReload}/>
            </div>) : (
            // Display list of companies if they exist
            <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
              <div className="flex flex-col justify-start gap-8">
                {companies.map(function (company) { return (<div key={company.id} className="">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="sm:h-[164px] md:h-fit">
                          {company.logoUrl ? (<Image src={company.logoUrl} width={150} height={150} className="rounded-lg object-cover" alt="Company Logo"/>) : (<FallbackLogo />)}
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <p className="text-xl font-medium text-gray-800">
                            {company.name}
                          </p>
                          <a href={"http://".concat(company.domain)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <LinkIcon />
                            <p className="text-base text-gray-600">
                              {company.domain}
                            </p>
                          </a>
                          <div className="flex items-center gap-2">
                            <CalendarIcon />
                            <p className="text-base text-gray-600">
                              Created on{" "}
                              {new Date(company.date_created).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <button onClick={function () {
                        return router.push("/brand/company/edit?companyId=".concat(company.id));
                    }} className="flex items-center gap-1 cursor-pointer">
                          <EditIcon />
                          <p className="text-sm font-semibold text-green-600">
                            Edit
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>); })}
              </div>
            </div>)}
        </>)}
    </div>);
};
// API route for data fetching
export function apiFetch(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, text, parser, doc, name_2, logo, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    url = req.query.url;
                    if (!url) {
                        return [2 /*return*/, res.status(400).json({ error: "URL is required" })];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://".concat(url))];
                case 2:
                    response = _e.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    return [4 /*yield*/, response.text()];
                case 3:
                    text = _e.sent();
                    parser = new DOMParser();
                    doc = parser.parseFromString(text, "text/html");
                    name_2 = ((_a = doc
                        .querySelector("meta[property='og:site_name']")) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || ((_b = doc.querySelector("title")) === null || _b === void 0 ? void 0 : _b.text);
                    logo = ((_c = doc.querySelector("meta[property='og:image']")) === null || _c === void 0 ? void 0 : _c.getAttribute("content")) ||
                        ((_d = doc.querySelector("img[alt*='logo']")) === null || _d === void 0 ? void 0 : _d.getAttribute("src"));
                    res.status(200).json({ name: name_2, logo: logo });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _e.sent();
                    res.status(500).json({ error: "Failed to fetch data" });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Static props for the page
export var getStaticProps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                props: {
                    title: "Company",
                },
            }];
    });
}); };
export default CompanyIndex;
