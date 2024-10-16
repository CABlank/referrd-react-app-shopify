import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";

import FullNameInput from "../common/FullNameInput";
import EmailInput from "../common/EmailInput";
import MobileInput from "../common/MobileInput";
import PasswordInput from "../common/PasswordInput";

import GoogleIcon from "../icons/GoogleIcon";
import ArrowLoginIcon from "../icons/ArrowLoginIcon";
import ShopifyPurpleIcon from "../icons/ShopifyPurpleIcon";
import ShopifyGreenIcon from "../icons/ShopifyGreenIcon";
import WorkEmailPurpleIcon from "../icons/WorkEmailPurpleIcon";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    shopifyStoreName: "", // Changed from shopifyStoreUrl to shopifyStoreName
  });
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false,
    noWhitespace: true,
  });
  const [registerMethod, setRegisterMethod] = useState<"email" | "shopify">("email");

  const router = useRouter();

  const validateShopifyStoreName = (name: string) => {
    // Simple validation to check if the store name is non-empty and contains no spaces
    return name.length > 0 && !name.includes(" ");
  };

  const handleOAuthRegister = (url: string) => {
    window.location.href = url;
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    // Implement your registration logic here
    router.push("/login");
  };

  const handleChange = (
    field: keyof typeof formData,
    value: ((prevState: string) => string) | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "function" ? value(prev[field]) : value,
    }));
  };

  const handleShopifyRegister = () => {
    // Validate the Shopify store name
    if (!validateShopifyStoreName(formData.shopifyStoreName)) {
      return;
    }

    // Construct the installation URL using the store name
    const storeName = formData.shopifyStoreName.trim();
    const clientId = "5c8e8b211dab8be3d06c888e36df66a0";
    const shopifyInstallURL = `https://${storeName}.myshopify.com/admin/oauth/install?client_id=${clientId}`;

    // Redirect the user to the installation URL
    handleOAuthRegister(shopifyInstallURL);
  };

  return (
    <form
      className="flex flex-col justify-start self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8"
      onSubmit={handleRegister}
    >
      {registerMethod === "email" ? (
        <>
          <button
            type="button"
            onClick={() =>
              handleOAuthRegister(
                `http://localhost:8055/auth/login/google?redirect=${encodeURIComponent(
                  "http://localhost:3000/auth/google"
                )}`
              )
            }
            className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5 hidden"
          >
            <GoogleIcon />
            <p className="text-base font-medium text-left text-[#851087]">Sign Up with Google</p>
          </button>
          <button
            type="button"
            onClick={() => setRegisterMethod("shopify")}
            className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5"
          >
            <ShopifyPurpleIcon />
            <p className="text-base font-medium text-left text-[#851087]">Sign Up with Shopify</p>
          </button>

          <div className="hidden">
            <FullNameInput
              fullName={formData.fullName}
              setFullName={(value) => handleChange("fullName", value)}
            />
            <EmailInput email={formData.email} setEmail={(value) => handleChange("email", value)} />
            <MobileInput
              mobile={formData.mobile}
              setMobile={(value) => handleChange("mobile", value)}
            />
            <PasswordInput
              password={formData.password}
              setPassword={(value) => handleChange("password", value)}
              setPasswordRequirements={setPasswordRequirements}
            />
          </div>
          <button
            type="submit"
            className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]"
          >
            <p className="text-base font-semibold text-left text-white">Sign Up With Email</p>
            <ArrowLoginIcon />
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
                value={formData.shopifyStoreName}
                onChange={(e) => handleChange("shopifyStoreName", e.target.value)}
                placeholder="your-store-name"
                className="flex-grow-1 flex-shrink-0 text-base text-left text-[#7f7f7f]"
              />
              <p className="text-base text-left text-[#7f7f7f]">.myshopify.com</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShopifyRegister}
            className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]"
          >
            <p className="text-base font-semibold text-left text-white">Sign Up With Shopify</p>
            <ArrowLoginIcon />
          </button>

          <div className="hidden">
            <button
              type="button"
              onClick={() => setRegisterMethod("email")}
              className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#851087]/5"
            >
              <WorkEmailPurpleIcon />
              <p className="text-base font-medium text-left text-[#851087]">Work Email Address</p>
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default RegisterForm;
