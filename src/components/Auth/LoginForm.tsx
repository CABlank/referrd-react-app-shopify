import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowLoginIcon from "../Icons/ArrowLoginIcon";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";
import GoogleIcon from "../Icons/GoogleIcon";
import ShopifyPurpleIcon from "../Icons/ShopifyPurpleIcon";
import ShopifyGreenIcon from "../Icons/ShopifyGreenIcon";
import WorkEmailPurpleIcon from "../Icons/WorkEmailPurpleIcon";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "shopify">("email");
  const router = useRouter();

  const handleGoogleLogin = () => {
    const directusOAuthURL = `https://api.referrd.com.au/auth/login/google?redirect=${encodeURIComponent(
      "http://localhost:3000/auth/google"
    )}`;
    window.location.href = directusOAuthURL;
  };

  const handleShopifyLogin = () => {
    const shopifyOAuthURL = `https://yourshopifyapp.com/auth/shopify?shop=${shopifyStoreUrl}.myshopify.com`;
    window.location.href = shopifyOAuthURL;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    await onLogin(email, password);
  };

  return (
    <form
      className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8"
      onSubmit={handleLogin}
    >
      {loginMethod === "email" ? (
        <>
          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showRequirements={false}
          />
          <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative">
            <p className="text-sm text-left">
              <span className="text-black/80">I may need to </span>
              <Link href="/request-new-password" legacyBehavior>
                <a className="text-[#10ad1b]">reset my password</a>
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
          <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative">
            <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-black/80">
              or
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLoginMethod("shopify")}
            className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5"
          >
            <ShopifyPurpleIcon />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
              Log in with Shopify
            </p>
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
            <p className="text-base font-medium text-left text-black/80">
              Shopify Store URL
            </p>
            <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative px-8 py-2 rounded-lg bg-white border-[0.5px] border-black/30">
              <ShopifyGreenIcon />
              <input
                type="text"
                value={shopifyStoreUrl}
                onChange={(e) => setShopifyStoreUrl(e.target.value)}
                placeholder="your-store"
                className="flex-grow-1 flex-shrink-0 text-base text-left text-[#7f7f7f]"
              />
              <p className="flex-grow-0 flex-shrink-0 text-base text-left text-[#7f7f7f]">
                .myshopify.com
              </p>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleShopifyLogin}
            className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]"
            disabled={loading}
          >
            <p className="text-base font-semibold text-left text-white">
              {loading ? "Logging in..." : "Log In"}
            </p>
            <ArrowLoginIcon />
          </button>
          <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative">
            <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-black/80">
              or
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5"
          >
            <WorkEmailPurpleIcon />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
              Work Email Address
            </p>
          </button>
        </>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5 hidden"
      >
        <GoogleIcon />
        <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#851087]">
          Log in with Google
        </p>
      </button>
    </form>
  );
};

export default LoginForm;
