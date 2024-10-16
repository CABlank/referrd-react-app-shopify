import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowLoginIcon from "../icons/ArrowLoginIcon";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";
import GoogleIcon from "../icons/GoogleIcon";
import ShopifyPurpleIcon from "../icons/ShopifyPurpleIcon";
import ShopifyGreenIcon from "../icons/ShopifyGreenIcon";
import WorkEmailPurpleIcon from "../icons/WorkEmailPurpleIcon";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopifyStoreName, setShopifyStoreName] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "shopify">("email");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateShopifyStoreName = (name: string) => {
    // Simple validation to check if the store name is non-empty and contains no spaces
    return name.length > 0 && !name.includes(" ");
  };

  const handleGoogleLogin = () => {
    const directusOAuthURL = `https://api.referrd.com.au/auth/login/google?redirect=${encodeURIComponent(
      "http://localhost:3000/auth/google"
    )}`;
    window.location.href = directusOAuthURL;
  };

  const handleShopifyLogin = () => {
    // Validate the Shopify store name
    if (!validateShopifyStoreName(shopifyStoreName)) {
      setError("Please enter a valid Shopify store name.");
      return;
    }

    // Construct the installation URL using the store name
    const storeName = shopifyStoreName.trim();
    const clientId = "5c8e8b211dab8be3d06c888e36df66a0";
    const shopifyInstallURL = `https://${storeName}.myshopify.com/admin/oauth/install?client_id=${clientId}`;

    // Redirect the user to the installation URL
    window.location.href = shopifyInstallURL;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error message

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      await onLogin(email, password);
      router.push("/brand/dashboard"); // Redirect to the dashboard or relevant page after successful login
    } catch (err) {
      setError("Failed to log in. Please check your credentials and try again.");
    }
  };

  return (
    <form
      className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8"
      onSubmit={handleLogin}
    >
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {loginMethod === "email" ? (
        <>
          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput password={password} setPassword={setPassword} showRequirements={false} />
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
            <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-black/80">or</p>
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
            <p className="text-base font-medium text-left text-black/80">Shopify Store Name</p>
            <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative px-8 py-2 rounded-lg bg-white border-[0.5px] border-black/30">
              <ShopifyGreenIcon />
              <input
                type="text"
                value={shopifyStoreName}
                onChange={(e) => setShopifyStoreName(e.target.value)}
                placeholder="your-store-name"
                className="flex-grow-1 flex-shrink-0 text-base text-left text-[#7f7f7f]"
              />
              <p className="flex-grow-0 flex-shrink-0 text-base text-left text-[#7f7f7f]">
                .myshopify.com
              </p>
            </div>
          </div>
          <button
            type="button"
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
            <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-black/80">or</p>
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
