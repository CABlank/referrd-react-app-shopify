import React, { useState } from "react";

interface FullNameInputProps {
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
}

const FullNameInput: React.FC<FullNameInputProps> = ({
  fullName,
  setFullName,
}) => {
  const [error, setError] = useState<string>("");

  const validateFullName = (name: string): boolean => {
    // Validate that the name is at least 5 characters and only contains letters, spaces, or hyphens
    if (!name) {
      setError("Full name cannot be empty.");
      return false;
    } else if (!/^[A-Za-z\s\-]{5,}$/.test(name)) {
      setError(
        "Full name must be at least 5 characters and contain only letters, spaces, or hyphens."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFullName(newName); // Update the state with every input change
    validateFullName(newName); // Validate on each change
  };

  // Determine the border color based on validation status
  const borderColor = () => {
    if (!fullName) return "border-black/30"; // Neutral border if empty
    return error ? "border-red-500" : "border-green-500"; // Red if error, green if valid
  };

  return (
    <div>
      <label
        htmlFor="fullName"
        className="text-base font-medium text-left text-black/80"
      >
        Full Name
      </label>
      <input
        id="fullName"
        type="text"
        required
        placeholder="Your Name"
        className={`w-full h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] text-black/80 ${borderColor()}`}
        value={fullName}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FullNameInput;
