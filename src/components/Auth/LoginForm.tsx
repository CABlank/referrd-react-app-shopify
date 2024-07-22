import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowLoginIcon from "../Icons/ArrowLoginIcon";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";
import GoogleIcon from "../Icons/GoogleIcon";
import { useSession } from "../../contexts/SessionContext";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleLogin = () => {
    const directusOAuthURL = `https://api.referrd.com.au/auth/login/google?redirect=${encodeURIComponent(
      "http://localhost:3000/auth/google"
    )}`;
    window.location.href = directusOAuthURL;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onLogin(email, password);
  };

  return (
    <form
      className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5"
      >
        <GoogleIcon />
        <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
          Log in with Google
        </p>
      </button>
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput
        password={password}
        setPassword={setPassword}
        showRequirements={false}
      />
      <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative">
        <p className="text-sm text-left">
          <span className="text-black/80">I may need to </span>
          <Link href="/request-new-password" passHref>
            reset my password
          </Link>
        </p>
      </div>
      <button
        type="submit"
        className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]"
        disabled={loading}
      >
        <p className="text-base font-semibold text-left text-white">
          {loading ? "Logging in..." : "Log In"}
        </p>
        <ArrowLoginIcon />
      </button>
    </form>
  );
};

export default LoginForm;
