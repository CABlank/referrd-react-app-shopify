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
import React, { useState } from "react";
import EyeIcon from "../Icons/EyeIcon";
import EyeOffIcon from "../Icons/EyeOffIcon";
import CheckIcon from "../Icons/CheckIcon";
import UncheckedIcon from "../Icons/UncheckedIcon";
var PasswordInput = function (_a) {
    var password = _a.password, setPassword = _a.setPassword, setPasswordRequirements = _a.setPasswordRequirements, _b = _a.showRequirements, showRequirements = _b === void 0 ? true : _b;
    var _c = useState(false), showPassword = _c[0], setShowPassword = _c[1];
    var handlePasswordChange = function (event) {
        var newPassword = event.target.value;
        setPassword(newPassword);
        if (setPasswordRequirements) {
            // Check password requirements
            var requirements_1 = {
                length: newPassword.length >= 8,
                number: /\d/.test(newPassword),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
                noWhitespace: /^\S+$/.test(newPassword),
            };
            // Update state with new requirements
            setPasswordRequirements(function (prevRequirements) { return (__assign(__assign({}, prevRequirements), requirements_1)); });
        }
    };
    var togglePasswordVisibility = function () {
        setShowPassword(!showPassword);
    };
    return (<div className="w-full">
      <label htmlFor="password" className="text-base font-medium text-left text-black/80">
        Password
      </label>
      <div className="flex items-center relative">
        <input id="password" type={showPassword ? "text" : "password"} required placeholder="Your Password" className="w-[26rem] h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] border-black/30 text-black/80" value={password} onChange={handlePasswordChange}/>
        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {showRequirements && password && (<PasswordRequirements requirements={{
                length: password.length >= 8,
                number: /\d/.test(password),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
                noWhitespace: /^\S+$/.test(password),
            }}/>)}
    </div>);
};
var PasswordRequirements = function (_a) {
    var requirements = _a.requirements;
    return (<div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3 p-4 rounded-sm border border-[#c2c8d0]">
      <p className="text-sm text-left text-[#2d333a]">
        Your password must contain:
      </p>
      <RequirementItem isValid={requirements.length}>
        At least 8 Characters
      </RequirementItem>
      <RequirementItem isValid={requirements.number}>
        At least one number
      </RequirementItem>
      <RequirementItem isValid={requirements.specialChar}>
        At least one special character (e.g., $, !, @, %, &)
      </RequirementItem>
      <RequirementItem isValid={requirements.noWhitespace}>
        No leading or trailing whitespace
      </RequirementItem>
    </div>);
};
var RequirementItem = function (_a) {
    var isValid = _a.isValid, children = _a.children;
    return (<div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      {isValid ? <CheckIcon /> : <UncheckedIcon />}
      <p className={"text-sm text-left ".concat(isValid ? "text-[#06B317]" : "text-[#686868]")}>
        {children}
      </p>
    </div>);
};
export default PasswordInput;
