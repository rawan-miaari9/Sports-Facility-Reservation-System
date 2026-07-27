"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ChevronLeft,
  Mail,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Lock,
  User as UserIcon,
  Phone,
  Calendar,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Buttom";
import { loginSchema, registerSchema } from "@/validators/auth/auth";

export function AuthForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-dismiss Error Message
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Auto-dismiss Success Message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBackToLanding = () => {
    router.push("/");
  };

  const handleLoginSuccess = (role: string) => {
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const validation = loginSchema.safeParse(loginData);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      // Save Token to localStorage & Cookies
      if (data.token) {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      const userPayload = data.user || data.data?.user || data;
      const userObj = {
        id: userPayload.id || userPayload._id || userPayload.userId || "usr_admin",
        name: userPayload.name || userPayload.fullName || userPayload.username || "Admin User",
        email: userPayload.email || loginData.email,
        role: userPayload.role || data.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(userObj));

      // Dispatch custom auth update event so App/Context updates instantly
      window.dispatchEvent(new Event("auth-change"));
      window.dispatchEvent(new Event("storage"));

      //Navigate to dashboard
      handleLoginSuccess(userObj.role);
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validation = registerSchema.safeParse(registerData);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registerData,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Registration failed");
        return;
      }

      setSuccessMessage("Registration successful. Please sign in.");
      setIsLogin(true);
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex lg:grid lg:grid-cols-12 overflow-hidden relative">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={handleBackToLanding}
        className="absolute top-6 left-6 z-20 px-4 py-2 font-bold"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Button>

      {/* Auth Form Container */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 md:px-16 bg-white min-h-screen w-full pt-20 pb-8">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>

            <div>
              <span className="font-display font-black text-xl tracking-wider text-primary uppercase">
                Athletic<span className="text-primary-container">Hub</span>
              </span>
              
            </div>
          </div>

          {/* Switcher */}
          <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isLogin ? "bg-white text-primary shadow-sm" : "text-gray-500"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? "bg-white text-primary shadow-sm" : "text-gray-500"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Email"
                label="Email Address"
                icon={Mail}
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />

              <Input
                type="password"
                placeholder="Password"
                label="Password"
                icon={Lock}
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <Button type="submit" fullWidth>
                Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Full Name"
                label="Full Name"
                icon={UserIcon}
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <Input
                type="text"
                placeholder="Email"
                label="Email"
                icon={Mail}
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <Input
                type="tel"
                placeholder="Phone"
                label="Phone"
                icon={Phone}
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <Input
                type="date"
                label="Date of Birth"
                icon={Calendar}
                value={registerData.dateOfBirth}
                onChange={(e) =>
                  setRegisterData({ ...registerData, dateOfBirth: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <Input
                type="password"
                placeholder="Password"
                label="Password"
                icon={Lock}
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="w-full pl-4 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <Button type="submit" fullWidth>
                Register <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:col-span-7 lg:block relative min-h-screen">
        <div className="absolute inset-0 bg-[#001f44]/80 z-10 mix-blend-multiply" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZguiv3hvRgVfOASmXtQjPgoZW1iohpP84dlm5BS_DWJlSbJ60J_vmV5hpFMllGrkliM0xGAT2n0c9m6W2LR7Rn3UjgM0J3Ankb1BDxf2JTgolKKID89D9kFV36Gvg_zvBLDw9vz9xcpAQzLy3fA8MItBmpM1sdRZdM1RHytNpcCehfuQc9IKD6jKHqOvN_dnNsCkxAWfDMEYzQoYiuQpzsMnxxBfYKBE4nAgRmOUcYinAbWWqhzCuqAibnlPR6Ih3j3BsC8FXg8E"
          alt="Visual asset showing basketball court inside premium athletic hub facility"
          className="w-full h-full object-cover absolute inset-0"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}