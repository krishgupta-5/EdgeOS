"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav
        className={`
          flex items-center gap-8 px-6 py-2 rounded-4xl
          transition-all duration-300
          border border-white/10
          ${
            scrolled
              ? "bg-black/40 backdrop-blur-xl shadow-lg"
              : "bg-white/5 backdrop-blur-md"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-white">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-orange-400 rounded-md" />
          EdgeOS
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition">
            Features
          </a>
          <a href="#" className="hover:text-white transition">
            Templates
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
          

        </div>

        {/* CTA */}
        <a
        href="/login"
          className="
            ml-4 px-4 py-1.5 rounded-lg text-sm font-medium
            bg-gradient-to-r from-[#7C3AED] to-[#A855F7]
            text-white hover:opacity-90 transition
          "
        >
          Login →
        </a>
      </nav>
    </div>
  );
}