import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import { useSession } from "../context/SessionContext";

const Login = () => {
  const [isLoginActive, setIsLoginActive] = useState(true); // State to toggle between login and sign up
  const router = useRouter();
  const { login, session, loading } = useSession();

  // Function to handle form submission
  const handleLogin = async (email: string, password: string) => {
    const credentials = {
      email,
      password,
    };

    try {
      // Log the user in
      await login(credentials);

      // The session is not immediately updated here. The useEffect below will handle redirection based on session change.
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout
      title="Referral Rewards Await!"
      subtitle="Discover how businesses are monetizing word of mouth"
    >
      <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-full sm:w-[468px] overflow-hidden gap-8 pb-8 rounded-2xl bg-white">
        {/* Toggle between Login and Signup */}
        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0">
          <div
            className={`flex justify-center cursor-pointer items-center self-stretch flex-grow relative px-2.5 py-5 border-t-0 border-r-0 ${
              isLoginActive
                ? "border-b-[1.5px] border-[#10ad1b]/50"
                : "border-b-[0.8px] border-black/30"
            }`}
            onClick={() => setIsLoginActive(true)}
            style={{ transition: "background-color 200ms" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(71, 183, 117, 0.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            <p
              className={`flex-grow-0 flex-shrink-0 text-xl font-medium text-left ${
                isLoginActive ? "text-[#10ad1b]" : "text-black/30"
              }`}
            >
              Log In
            </p>
          </div>
          <div
            className={`flex justify-center cursor-pointer items-center self-stretch flex-grow relative px-2.5 py-5 border-t-0 border-r-0 ${
              !isLoginActive
                ? "border-b-[1.5px] border-[#10ad1b]/50"
                : "border-b-[0.8px] border-black/30"
            }`}
            onClick={() => setIsLoginActive(false)}
            style={{ transition: "background-color 200ms" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(71, 183, 117, 0.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            <p
              className={`flex-grow-0 flex-shrink-0 text-xl font-medium text-left ${
                !isLoginActive ? "text-[#10ad1b]" : "text-black/30"
              }`}
            >
              Sign Up
            </p>
          </div>
        </div>
        {isLoginActive ? (
          <LoginForm onLogin={handleLogin} loading={loading} />
        ) : (
          <RegisterForm />
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;
