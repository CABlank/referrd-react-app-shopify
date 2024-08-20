import React, { useState } from "react";
var MobileInput = function (_a) {
    var mobile = _a.mobile, setMobile = _a.setMobile;
    var _b = useState(""), error = _b[0], setError = _b[1];
    var validateMobile = function (mobile) {
        // Simple validation for a typical mobile number (adjust regex as needed for your requirements)
        var mobileRegex = /^\+?(\d{1,3})\s?(\d{3,})$/;
        if (!mobile) {
            setError("Mobile number cannot be empty.");
            return false;
        }
        else if (!mobileRegex.test(mobile)) {
            setError("Please enter a valid mobile number without whitesapce and not -.");
            return false;
        }
        setError("");
        return true;
    };
    var handleChange = function (e) {
        var newMobile = e.target.value;
        setMobile(newMobile); // Update the state with every input change
        validateMobile(newMobile); // Validate on each change
    };
    // Determine the border color based on validation status
    var borderColor = function () {
        if (!mobile)
            return "border-black/30"; // Neutral border if empty
        return error ? "border-red-500" : "border-green-500"; // Red if error, green if valid
    };
    return (<div className="w-full">
      <label htmlFor="mobile" className="text-base font-medium text-left text-black/80">
        Mobile Number
      </label>
      <input id="mobile" type="tel" required placeholder="Mobile Number" className={"w-full h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] text-black/80 ".concat(borderColor())} value={mobile} onChange={handleChange}/>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>);
};
export default MobileInput;
