import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import AuthLayout from "../components/auth-layout/AuthLayout";
import { useSession } from "../context/SessionContext";

const Login = () => {
  const [isLoginActive, setIsLoginActive] = useState(true); // Toggle between login and sign-up
  const router = useRouter();
  const { session, loading, login } = useSession(); // Retrieve session context

  // UseEffect to check if the user is already logged in based on the session
  useEffect(() => {
    // If session is present, redirect to the dashboard
    if (session && session.accessToken) {
      if (session.user.role === "Brand") {
        router.push("/brand/dashboard");
      } else if (session.user.role === "Customer") {
        router.push("/customer/shares");
      }
    }
  }, [session, router]); // Dependency on session and router

  // Handle login form submission
  const handleLogin = async (email: string, password: string) => {
    try {
      // Log the user in by using the session context's login function
      await login({ email, password });
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
              (e.currentTarget.style.backgroundColor = "rgba(71, 183, 117, 0.2)")
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
              (e.currentTarget.style.backgroundColor = "rgba(71, 183, 117, 0.2)")
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
        {isLoginActive ? <LoginForm onLogin={handleLogin} loading={loading} /> : <RegisterForm />}
      </div>
    </AuthLayout>
  );
};

export default Login;
