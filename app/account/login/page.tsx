"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabaseClient } from "@/app/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    supabaseClient.auth
      .signInWithPassword({
        email,
        password,
      })
      .then(({ error }) => {
        if (error) {
          alert("Login failed: " + error.message);
        } else {
          // Redirect to dashboard after successful login
          router.push("/dashboard");
        }
      });
  };

  const handleGoogleLogin = () => {
    // Empty backend functionality as requested
    console.log("Google Login initiated");
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden px-4 selection:bg-red-500/30">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Auth Card */}
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="group flex items-center gap-2 select-none">
            <h1 className="text-red-600 text-shadow-black text-3xl tracking-widest font-black transition-transform group-hover:scale-105" style={{ fontFamily: "var(--font-bebas)" }}>
              MOVIE NIGHT
            </h1>
          </Link>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight text-center">
          Welcome back
        </h2>
        <p className="text-neutral-400 text-sm text-center mb-8">
          Enter your details to access your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3.5 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5 pt-2 relative">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-neutral-300">
                Password
              </label>
              <Link href="#" className="text-xs text-red-500 hover:text-red-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3.5 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-neutral-800"></div>
          <span className="px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-1 border-t border-neutral-800"></div>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white hover:bg-neutral-200 text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FcGoogle className="text-2xl" />
          <span>Google</span>
        </button>

        {/* Footer Link */}
        <p className="mt-8 text-center text-neutral-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/account/signup"
            className="text-white hover:text-red-500 font-medium transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </main>
  );
}
