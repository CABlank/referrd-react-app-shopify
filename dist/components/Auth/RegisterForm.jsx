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
import ArrowLoginIcon from "../Icons/ArrowLoginIcon";
import FullNameInput from "../common/FullNameInput";
import EmailInput from "../common/EmailInput";
import MobileInput from "../common/MobileInput";
import PasswordInput from "../common/PasswordInput";
import GoogleIcon from "../Icons/GoogleIcon";
import ShopifyPurpleIcon from "../Icons/ShopifyPurpleIcon";
import ShopifyGreenIcon from "../Icons/ShopifyGreenIcon";
import WorkEmailPurpleIcon from "../Icons/WorkEmailPurpleIcon";
var RegisterForm = function () {
    var _a = useState(""), fullName = _a[0], setFullName = _a[1];
    var _b = useState(""), email = _b[0], setEmail = _b[1];
    var _c = useState(""), mobile = _c[0], setMobile = _c[1];
    var _d = useState(""), password = _d[0], setPassword = _d[1];
    var _e = useState({
        length: false,
        number: false,
        specialChar: false,
        noWhitespace: true,
    }), passwordRequirements = _e[0], setPasswordRequirements = _e[1];
    var _f = useState(""), shopifyStoreUrl = _f[0], setShopifyStoreUrl = _f[1];
    var _g = useState("email"), registerMethod = _g[0], setRegisterMethod = _g[1];
    var router = useRouter();
    var handleGoogleRegister = function () {
        var directusOAuthURL = "http://localhost:8055/auth/login/google?redirect=".concat(encodeURIComponent("http://localhost:3000/auth/google"));
        window.location.href = directusOAuthURL;
    };
    var handleShopifyRegister = function () {
        var shopifyOAuthURL = "https://yourshopifyapp.com/auth/shopify?shop=".concat(shopifyStoreUrl, ".myshopify.com");
        window.location.href = shopifyOAuthURL;
    };
    var handleRegister = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            event.preventDefault();
            // Implement your registration logic here
            router.push("/login");
            return [2 /*return*/];
        });
    }); };
    return (<form className="flex flex-col justify-start self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8" onSubmit={handleRegister}>
      {registerMethod === "email" ? (<>
          {/* Google Register Button */}
          <button type="button" // Ensure this is set so it doesn't submit the form
         onClick={handleGoogleRegister} className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5 hidden">
            <GoogleIcon />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
              Sign Up with Google
            </p>
          </button>

          {/* Shopify Register Button */}
          <button type="button" onClick={function () { return setRegisterMethod("shopify"); }} className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5">
            <ShopifyPurpleIcon />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
              Sign Up with Shopify
            </p>
          </button>

          {/* Full Name Input */}
          <FullNameInput fullName={fullName} setFullName={setFullName}/>

          {/* Email Input */}
          <EmailInput email={email} setEmail={setEmail}/>

          {/* Mobile Number Input */}
          <MobileInput mobile={mobile} setMobile={setMobile}/>

          {/* Password Input */}
          <PasswordInput password={password} setPassword={setPassword} setPasswordRequirements={setPasswordRequirements}/>

          {/* Submit Button */}
          <button type="submit" className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]">
            <p className="text-base font-semibold text-left text-white">
              Sign Up With Email
            </p>
            <ArrowLoginIcon />
          </button>
        </>) : (<>
          {/* Shopify Store URL Input */}
          <div className="flex flex-col items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
            <p className="text-base font-medium text-left text-black/80">
              Shopify Store URL
            </p>
            <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative px-8 py-2 rounded-lg bg-white border-[0.5px] border-black/30">
              <ShopifyGreenIcon />
              <input type="text" value={shopifyStoreUrl} onChange={function (e) { return setShopifyStoreUrl(e.target.value); }} placeholder="your-store" className="flex-grow-1 flex-shrink-0 text-base text-left text-[#7f7f7f]"/>
              <p className="flex-grow-0 flex-shrink-0 text-base text-left text-[#7f7f7f]">
                .myshopify.com
              </p>
            </div>
          </div>

          {/* Submit Button for Shopify */}
          <button type="button" onClick={handleShopifyRegister} className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]">
            <p className="text-base font-semibold text-left text-white">
              Sign Up With Shopify
            </p>
            <ArrowLoginIcon />
          </button>

          {/* Option to switch back to email registration */}
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative mt-4">
            <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-black/80">
              or
            </p>
          </div>
          <button type="button" onClick={function () { return setRegisterMethod("email"); }} className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5">
            <WorkEmailPurpleIcon />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
              Work Email Address
            </p>
          </button>

          <button type="button" // Ensure this is set so it doesn't submit the form
         onClick={handleGoogleRegister} className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5 hidden">
            <GoogleIcon />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
              Sign Up with Google
            </p>
          </button>
        </>)}
    </form>);
};
export default RegisterForm;
