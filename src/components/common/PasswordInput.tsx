import React, { useState } from "react";
import EyeIcon from "../icons/EyeIcon";
import EyeOffIcon from "../icons/EyeOffIcon";
import CheckIcon from "../icons/CheckIcon";
import UncheckedIcon from "../icons/UncheckedIcon";

interface PasswordInputProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRequirements?: React.Dispatch<
    React.SetStateAction<{
      length: boolean;
      number: boolean;
      specialChar: boolean;
      noWhitespace: boolean;
    }>
  >;
  showRequirements?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  setPasswordRequirements,
  showRequirements = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    if (setPasswordRequirements) {
      // Check password requirements
      const requirements = {
        length: newPassword.length >= 8,
        number: /\d/.test(newPassword),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        noWhitespace: /^\S+$/.test(newPassword),
      };
      // Update state with new requirements
      setPasswordRequirements((prevRequirements) => ({
        ...prevRequirements, // Preserve other values in the state
        ...requirements, // Overwrite with new requirements
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <label htmlFor="password" className="text-base font-medium text-left text-black/80">
        Password
      </label>
      <div className="flex items-center relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          required
          placeholder="Your Password"
          className="w-[26rem] h-12 px-8 py-4 rounded-lg bg-white border-[0.5px] border-black/30 text-black/80"
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {showRequirements && password && (
        <PasswordRequirements
          requirements={{
            length: password.length >= 8,
            number: /\d/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            noWhitespace: /^\S+$/.test(password),
          }}
        />
      )}
    </div>
  );
};

const PasswordRequirements = ({
  requirements,
}: {
  requirements: {
    length: boolean;
    number: boolean;
    specialChar: boolean;
    noWhitespace: boolean;
  };
}) => {
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3 p-4 rounded-sm border border-[#c2c8d0]">
      <p className="text-sm text-left text-[#2d333a]">Your password must contain:</p>
      <RequirementItem isValid={requirements.length}>At least 8 Characters</RequirementItem>
      <RequirementItem isValid={requirements.number}>At least one number</RequirementItem>
      <RequirementItem isValid={requirements.specialChar}>
        At least one special character (e.g., $, !, @, %, &)
      </RequirementItem>
      <RequirementItem isValid={requirements.noWhitespace}>
        No leading or trailing whitespace
      </RequirementItem>
    </div>
  );
};

const RequirementItem = ({
  isValid,
  children,
}: {
  isValid: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      {isValid ? <CheckIcon /> : <UncheckedIcon />}
      <p className={`text-sm text-left ${isValid ? "text-[#06B317]" : "text-[#686868]"}`}>
        {children}
      </p>
    </div>
  );
};

export default PasswordInput;
