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
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import NextImage from "next/image";
import { createCompany, updateCompany, fetchCompany, deleteCompany, uploadFile, } from "../../../services/company/company";
import { useSession } from "../../../contexts/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import FallbackLogo from "../../../components/Icons/FallbackLogo";
var EditCompany = function () {
    var router = useRouter();
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var companyId = router.query.companyId;
    var _b = useState({
        name: "",
        domain: "",
        logo: null,
        date_created: "",
    }), company = _b[0], setCompany = _b[1];
    var _c = useState(null), logoPreview = _c[0], setLogoPreview = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var _f = useState(null), logoError = _f[0], setLogoError = _f[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        var loadCompany = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && companyId && !loadExecutedRef.current)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        setLoading(true);
                        loadExecutedRef.current = true;
                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                return fetchCompany(parseInt(companyId), token);
                            })];
                    case 2:
                        data = _a.sent();
                        setCompany(data);
                        if (data.logoUrl) {
                            setLogoPreview(data.logoUrl);
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        console.error("Error fetching company:", err_1);
                        setError("Failed to fetch company. Please try again.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        if (companyId) {
            loadCompany();
        }
    }, [session, companyId, withTokenRefresh]);
    var handleChange = function (field, value) {
        setCompany(function (prevCompany) {
            var _a;
            return (__assign(__assign({}, prevCompany), (_a = {}, _a[field] = value, _a)));
        });
    };
    var handleFileChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            var file_1 = e.target.files[0];
            var objectUrl_1 = URL.createObjectURL(file_1);
            var img = new window.Image();
            img.src = objectUrl_1;
            img.onload = function () {
                setLogoPreview(objectUrl_1);
                setCompany(function (prevCompany) { return (__assign(__assign({}, prevCompany), { logo: file_1 })); });
                setLogoError(null); // Clear the error if a file is selected
            };
        }
    };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var logoId, updatedCompany_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Validate if logo is provided before making any API call
                    if (!company.logo) {
                        setLogoError("Logo is required.");
                        return [2 /*return*/]; // Stop execution if no logo is provided
                    }
                    if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 10];
                    setLoading(true);
                    setError(null); // Clear any previous error
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    logoId = company.logo;
                    if (!(typeof company.logo !== "string")) return [3 /*break*/, 3];
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return uploadFile(company.logo, token);
                        })];
                case 2:
                    logoId = _a.sent();
                    _a.label = 3;
                case 3:
                    updatedCompany_1 = __assign(__assign({}, company), { logo: logoId });
                    if (!companyId) return [3 /*break*/, 5];
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return updateCompany(updatedCompany_1, token);
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, withTokenRefresh(function (token) {
                        return createCompany(updatedCompany_1, token);
                    })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    router.push("/brand/company");
                    return [3 /*break*/, 10];
                case 8:
                    err_2 = _a.sent();
                    console.error("Error saving company:", err_2);
                    setError("Failed to save company. Please fill all fields.");
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((session === null || session === void 0 ? void 0 : session.token) && companyId)) return [3 /*break*/, 5];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return deleteCompany(parseInt(companyId), token);
                        })];
                case 2:
                    _a.sent();
                    router.push("/brand/company");
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    router.push("/brand/company");
                    console.error("Error deleting company:", err_3);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col justify-start items-center max-w-full mx-auto gap-8 p-4">
        <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {companyId ? "Edit" : "Create"} Company
          </h2>
          {error && <p className="text-red-600">{error}</p>}
          {logoError && <p className="text-red-600">{logoError}</p>}
          <div className="flex flex-col gap-4 w-full">
            <label className="text-xl font-medium text-black/80">
              Company Name
            </label>
            <input type="text" value={company.name} onChange={function (e) { return handleChange("name", e.target.value); }} className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80" placeholder="Company Name"/>
            <label className="text-xl font-medium text-black/80">Domain</label>
            <input type="text" value={company.domain} onChange={function (e) { return handleChange("domain", e.target.value); }} className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80" placeholder="Domain"/>
            <label className="text-xl font-medium text-black/80">Logo</label>
            {logoPreview ? (<NextImage src={logoPreview} width={96} // Set the desired width
         height={96} // Set the desired height
         className="w-24 h-24 rounded-lg object-cover mb-4" alt="Company Logo"/>) : (<FallbackLogo />)}
            <input type="file" onChange={handleFileChange} className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80"/>
          </div>
          <div className="flex justify-between w-full">
            <button onClick={handleSubmit} className="h-12 w-1/6 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">
              Save
            </button>
            {companyId && (<button onClick={handleDelete} className="h-12 w-1/6 px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
                Delete
              </button>)}
          </div>
        </div>
      </div>
    </div>);
};
export default EditCompany;
