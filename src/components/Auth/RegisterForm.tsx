import React, { useState } from "react";
import { useRouter } from "next/router";
import ArrowLoginIcon from "../Icons/ArrowLoginIcon";
import FullNameInput from "../common/FullNameInput";
import EmailInput from "../common/EmailInput";
import MobileInput from "../common/MobileInput";
import PasswordInput from "../common/PasswordInput";
import GoogleIcon from "../Icons/GoogleIcon";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false,
    noWhitespace: true,
  });

  const router = useRouter();

  const handleGoogleRegister = () => {
    const expectedRedirectUri = "http://localhost:3000/auth/google";
    const directusOAuthURL = `http://localhost:8055/auth/login/google?redirect=${encodeURIComponent(
      expectedRedirectUri
    )}`;

    window.location.href = directusOAuthURL;
  };

  const handleRegister = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Implement your registration logic here
    router.push("/login");
  };

  return (
    <form
      className="flex flex-col justify-start self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8"
      onSubmit={handleRegister}
    >
      {/* Google Register Button */}
      <button
        type="button" // Ensure this is set so it doesn't submit the form
        onClick={handleGoogleRegister}
        className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5"
      >
        <GoogleIcon />
        <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
          Sign Up with Google
        </p>
      </button>

      {/* Full Name Input */}
      <FullNameInput fullName={fullName} setFullName={setFullName} />

      {/* Email Input */}
      <EmailInput email={email} setEmail={setEmail} />

      {/* Mobile Number Input */}
      <MobileInput mobile={mobile} setMobile={setMobile} />

      {/* Password Input */}
      <PasswordInput
        password={password}
        setPassword={setPassword}
        setPasswordRequirements={setPasswordRequirements}
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]"
      >
        <p className="text-base font-semibold text-left text-white">
          Sign Up With Email
        </p>
        <ArrowLoginIcon />
      </button>
    </form>
  );
};

export default RegisterForm;
