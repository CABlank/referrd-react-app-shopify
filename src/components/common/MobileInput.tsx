import React, { useState } from "react";

interface MobileInputProps {
  mobile: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
}

const MobileInput: React.FC<MobileInputProps> = ({ mobile, setMobile }) => {
  const [error, setError] = useState<string>("");

  const validateMobile = (mobile: string): boolean => {
    // Simple validation for a typical mobile number (adjust regex as needed for your requirements)
    const mobileRegex = /^\+?(\d{1,3})\s?(\d{3,})$/;
    if (!mobile) {
      setError("Mobile number cannot be empty.");
      return false;
    } else if (!mobileRegex.test(mobile)) {
      setError(
        "Please enter a valid mobile number without whitesapce and not -."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMobile = e.target.value;
    setMobile(newMobile); // Update the state with every input change
    validateMobile(newMobile); // Validate on each change
  };

  // Determine the border color based on validation status
  const borderColor = () => {
    if (!mobile) return "border-black/30"; // Neutral border if empty
    return error ? "border-red-500" : "border-green-500"; // Red if error, green if valid
  };

  return (
    <div className="w-full">
      <label
        htmlFor="mobile"
        className="text-base font-medium text-left text-black/80"
      >
        Mobile Number
      </label>
      <input
        id="mobile"
        type="tel"
        required
        placeholder="Mobile Number"
        className={`w-full h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] text-black/80 ${borderColor()}`}
        value={mobile}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MobileInput;
