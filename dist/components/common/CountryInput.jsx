import React, { useState } from "react";
var CountryInput = function (_a) {
    var country = _a.country, setCountry = _a.setCountry;
    var _b = useState(""), error = _b[0], setError = _b[1];
    var validateCountry = function (name) {
        // Validate that the input is not empty and is a valid country name (simplified example)
        if (!name) {
            setError("Country cannot be empty.");
            return false;
        }
        else if (!/^[A-Za-z\s\-]{2,}$/.test(name)) {
            setError("Country must be at least 2 characters and contain only letters, spaces, or hyphens.");
            return false;
        }
        setError("");
        return true;
    };
    var handleChange = function (e) {
        var newCountry = e.target.value;
        setCountry(newCountry); // Update the state with every input change
        validateCountry(newCountry); // Validate on each change
    };
    // Determine the border color based on validation status
    var borderColor = function () {
        if (!country)
            return "border-black/30"; // Neutral border if empty
        return error ? "border-red-500" : "border-green-500"; // Red if error, green if valid
    };
    return (<div className="w-full">
      <label htmlFor="country" className="text-base font-medium text-left text-black/80">
        Country
      </label>
      <input id="country" type="text" required placeholder="Enter Country" className={"w-full h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] text-black/80 ".concat(borderColor())} value={country} onChange={handleChange}/>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>);
};
export default CountryInput;
