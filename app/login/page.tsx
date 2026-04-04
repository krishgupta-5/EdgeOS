"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center text-white">

      <div className="w-full max-w-sm text-center space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-xl">
            F
          </div>
          <h1 className="text-2xl font-semibold">EdgeOS</h1>
          <p className="text-gray-400 text-sm">Welcome back</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">

          <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-700 py-2.5 rounded-lg hover:bg-gray-900 transition">
            <FaGithub />
            Continue with GitHub
          </button>

        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500">
          By continuing, you agree to our Terms & Policy
        </p>

        {/* Back to Home (exact style) */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 flex items-center justify-center gap-2 mx-auto text-sm text-gray-500 hover:text-gray-300 transition"
        >
          <span className="text-base leading-none">←</span>
          <span>Back to home</span>
        </button>

      </div>
    </main>
  );
}