import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import FullNameInput from "../components/common/FullNameInput";
import MobileInput from "../components/common/MobileInput";
import PasswordInput from "../components/common/PasswordInput";
import ArrowLoginIcon from "../components/Icons/ArrowLoginIcon";
import AuthLayout from "../components/AuthLayout/AuthLayout";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(false); // To check if the token is valid
  const [loading, setLoading] = useState(true); // Loading state while verifying token
  const router = useRouter();

  useEffect(() => {
    // Extract token from the URL
    const { token } = router.query;

    if (token) {
      // Verify token with backend
      fetch(`/api/verify-token?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTokenValid(true); // Token is valid
            setFormData((prev) => ({
              ...prev,
              email: data.email, // Pre-fill email if available from token verification
            }));
          } else {
            setErrorMessage("Invalid or expired token.");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          setErrorMessage("Failed to verify token.");
        })
        .finally(() => setLoading(false));
    } else {
      setErrorMessage("No token provided.");
      setLoading(false);
    }
  }, [router.query]);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { token } = router.query; // Get the token from URL query params

    try {
      const response = await fetch("/api/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token, // Pass token for validation on the backend
          fullName: formData.fullName,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/login");
      } else {
        setErrorMessage(data.message || "Failed to complete registration.");
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <p>Loading...</p>; // Show loading while verifying the token
  }

  if (!tokenValid) {
    return <p>{errorMessage}</p>; // Show error message if token is invalid
  }

  return (
    <AuthLayout
      title="Referral Rewards Await!"
      subtitle="Discover how businesses are monetizing word of mouth"
    >
      <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-full sm:w-[468px] overflow-hidden gap-8 pb-8 rounded-2xl bg-white">
        <form
          className="mt-8 flex flex-col justify-start self-stretch flex-grow-0 flex-shrink-0 gap-4 px-8"
          onSubmit={handleRegister}
        >
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          <FullNameInput
            fullName={formData.fullName}
            setFullName={(value) => handleChange("fullName", value)}
          />
          <MobileInput
            mobile={formData.mobile}
            setMobile={(value) => handleChange("mobile", value)}
          />
          <PasswordInput
            password={formData.password}
            setPassword={(value) => handleChange("password", value)}
            setPasswordRequirements={() => {}}
          />
          <button
            type="submit"
            className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-12 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775]"
            disabled={loading}
          >
            <p className="text-base font-semibold text-left text-white">
              Complete Registration
            </p>
            <ArrowLoginIcon />
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
