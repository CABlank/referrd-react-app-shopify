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
import { useRouter } from "next/router";
import { useSession } from "../../../context/SessionContext";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AuthLayout from "../AuthLayout/AuthLayout";
var Tab = function (_a) {
    var isActive = _a.isActive, onClick = _a.onClick, label = _a.label;
    return (<div className={"flex justify-center cursor-pointer items-center flex-grow relative px-2.5 py-5 ".concat(isActive
            ? "border-b-[1.5px] border-[#10ad1b]/50"
            : "border-b-[0.8px] border-black/30")} onClick={onClick} style={{ transition: "background-color 200ms" }} onMouseEnter={function (e) {
            return (e.currentTarget.style.backgroundColor = "rgba(71, 183, 117, 0.2)");
        }} onMouseLeave={function (e) { return (e.currentTarget.style.backgroundColor = ""); }}>
    <p className={"text-xl font-medium ".concat(isActive ? "text-[#10ad1b]" : "text-black/30")}>
      {label}
    </p>
  </div>);
};
var Login = function () {
    var _a = useState(true), isLoginActive = _a[0], setIsLoginActive = _a[1];
    var router = useRouter();
    var _b = useSession(), login = _b.login, loading = _b.loading;
    var handleLogin = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, login({ email: email, password: password })];
                case 1:
                    _a.sent();
                    router.push("/"); // Redirect to homepage or another protected route after login
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Login failed:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<AuthLayout title="Referral Rewards Await!" subtitle="Discover how businesses are monetizing word of mouth">
      <div className="flex flex-col items-center w-full sm:w-[468px] gap-8 pb-8 rounded-2xl bg-white">
        <div className="flex justify-between items-center w-full">
          <Tab isActive={isLoginActive} onClick={function () { return setIsLoginActive(true); }} label="Log In"/>
          <Tab isActive={!isLoginActive} onClick={function () { return setIsLoginActive(false); }} label="Sign Up"/>
        </div>
        {isLoginActive ? (<LoginForm onLogin={handleLogin} loading={loading}/>) : (<RegisterForm />)}
      </div>
    </AuthLayout>);
};
export default Login;
