"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabaseClient } from "@/app/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Details, 2: Verification
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: username,
          },
        },
      });

      if (error) {
        console.error("Error during sign up:", error);
        alert(error.message || "Signup failed");
        return;
      }

      console.log("Sign up successful, verification email sent.");
      setStep(2); // ✅ هنا بس
    } else {
      if (verificationCode.length !== 8) {
        alert("Please enter a valid 8-digit code");
        return;
      }

      const { error } = await supabaseClient.auth.verifyOtp({
        email,
        token: verificationCode,
        type: "signup",
      });

      if (error) {
        console.error("Error during email verification:", error);
        alert(error.message || "Invalid code");
        return;
      }

      console.log("Email verified successfully!");
      alert("Your account has been created and verified!");

      // redirect هنا
      router.push("/account/login");
    }
  };

  const handleGoogleSignup = () => {
    // Empty backend functionality as requested
    console.log("Google Signup initiated");
  };

  return (
    <main className="min-h-screen py-12 relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden px-4 selection:bg-red-500/30">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Auth Card */}
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="group flex items-center gap-2 select-none">
            <h1
              className="text-red-600 text-shadow-black text-3xl tracking-widest font-black transition-transform group-hover:scale-105"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              MOVIE NIGHT
            </h1>
          </Link>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight text-center">
          {step === 1 ? "Create an account" : "Verify your email"}
        </h2>
        <p className="text-neutral-400 text-sm text-center mb-6">
          {step === 1
            ? "Welcome to Movie Night. Start your cinematic journey here."
            : `We've sent an 8-digit code to ${email}`}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {step === 1 ? (
            <>
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-300 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5 pt-2 relative">
                <label className="text-sm font-medium text-neutral-300 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all"
                />
              </div>

              {/* Passwords Flex Row */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                {/* Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-sm font-medium text-neutral-300 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-sm font-medium text-neutral-300 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                  {confirmPassword.length > 0 &&
                    confirmPassword !== password && (
                      <p className="text-red-500 text-xs mt-1 ml-1 text-left">
                        Passwords do not match.
                      </p>
                    )}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-300 ml-1">
                  8-Digit Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="1 2 3 4 5 6 7 8"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-4 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all text-center text-2xl tracking-[0.5em] font-bold"
                  />
                </div>
                <p className="text-neutral-500 text-[11px] text-center mt-2 px-4">
                  Please check your inbox. If you don&apos;t see it, check your
                  spam folder.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Edit details
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 mt-2">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
            >
              {step === 1 ? "Sign Up" : "Verify Code"}
            </button>
          </div>
        </form>

        {step === 1 && (
          <>
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-neutral-800"></div>
              <span className="px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Or sign up with
              </span>
              <div className="flex-1 border-t border-neutral-800"></div>
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full bg-white hover:bg-neutral-200 text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FcGoogle className="text-2xl" />
              <span>Google</span>
            </button>
          </>
        )}

        {/* Footer Link */}
        <p className="mt-8 text-center text-neutral-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="text-white hover:text-red-500 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
