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
import LinkIcon from "../../../components/Icons/LinkIcon";
import FallbackLogo from "../../../components/Icons/FallbackLogo";
import Image from "next/image";
import { fetchCompaniesWithLogo, deleteCompany, } from "../../../services/company/company";
import { useSession } from "../../../contexts/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
var CompanyIndex = function () {
    var router = useRouter();
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var _b = useState([]), companies = _b[0], setCompanies = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState(true), needsReload = _e[0], setNeedsReload = _e[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        var loadCompanies = function () { return __awaiter(void 0, void 0, void 0, function () {
            var companiesData, err_1;
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
                        err_1 = _a.sent();
                        console.error("Error fetching companies:", err_1);
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
    var handleDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 5];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) { return deleteCompany(id, token); })];
                case 2:
                    _a.sent();
                    setCompanies(companies.filter(function (company) { return company.id !== id; }));
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error("Error deleting company:", err_2);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    setNeedsReload(true); // Trigger reload after delete operation
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}

      {error && <p className="text-red-600">{error}</p>}
      {companies.length === 0 ? (<button onClick={function () { return router.push("/brand/company/edit"); }} className="h-12 px-6 py-2 rounded-lg bg-[#47B775] text-white font-medium hover:bg-green-700 mb-4">
          Create Company
        </button>) : (<div className="flex flex-col justify-start gap-8">
          {companies.map(function (company) { return (<div key={company.id} className="flex flex-col items-start p-8 gap-4 w-full rounded-2xl bg-white shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start w-full">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="sm:h-[164px] md:h-fit">
                    {company.logoUrl ? (<Image src={company.logoUrl} width={96} // Set the desired width
                 height={96} // Set the desired height
                 className="w-24 h-24 rounded-lg object-cover" alt="Company Logo"/>) : (<FallbackLogo />)}
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
                    <p className="text-sm font-semibold text-green-600">Edit</p>
                  </button>
                  <button onClick={function () { return handleDelete(company.id); }} className="flex items-center gap-1 cursor-pointer">
                    <DeleteIcon />
                    <p className="text-sm font-semibold text-red-600">Delete</p>
                  </button>
                </div>
              </div>
            </div>); })}
        </div>)}
    </div>);
};
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
