import React, { useState } from "react";
var EmailInput = function (_a) {
    var email = _a.email, setEmail = _a.setEmail;
    var _b = useState(""), error = _b[0], setError = _b[1];
    var validateEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex validation
        if (!email) {
            setError("Email cannot be empty.");
            return false;
        }
        else if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        setError("");
        return true;
    };
    var handleChange = function (e) {
        var newEmail = e.target.value;
        setEmail(newEmail); // Update the state with every input change
        validateEmail(newEmail); // Validate on each change
    };
    // Determine the border color based on validation status
    var borderColor = function () {
        if (!email)
            return "border-black/30"; // Neutral border if empty
        return error ? "border-red-500" : "border-green-500"; // Red if error, green if valid
    };
    return (<div className="w-full">
      <label htmlFor="email" className="text-base font-medium text-left text-black/80">
        Work Email Address
      </label>
      <input id="email" type="email" required placeholder="Email Address" className={"w-full h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] text-black/80 ".concat(borderColor())} value={email} onChange={handleChange}/>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>);
};
export default EmailInput;
