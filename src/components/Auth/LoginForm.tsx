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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = () => {
    const directusOAuthURL = `https://api.referrd.com.au/auth/login/google?redirect=${encodeURIComponent(
      "http://localhost:3000/auth/google"
    )}`;
    window.location.href = directusOAuthURL;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    try {
      await onLogin(email, password);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        .loader {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100px;
          height: 100px;
        }
        .dot {
          width: 20px;
          height: 20px;
          background-color: #851087;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
      `}</style>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-75 backdrop-blur-md">
          <div className="loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
      <form
        className={`flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8 ${
          loading ? "blur-sm pointer-events-none" : ""
        }`}
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
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
