import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useState } from "react";
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
  <>
        {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b">
      <a href="/"><h1 className="text-xl font-bold">MyJob.ma</h1></a>
      <button
        className="md:hidden text-blue-600 focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      <nav className="hidden md:flex space-x-6 text-sm font-medium ">
          <a href="/signup" className="hover:text-blue-600">Find Talent</a>
          <a href="/signup" className="hover:text-blue-600">Find Work</a>
          <a href="/whyus" className="hover:text-blue-600">Why Us</a>
          <a href="signin" className="hover:text-blue-600">Sign in</a>
          <a href="signup" className="hover:text-blue-600">Sign up</a>
          
        </nav>
    </header>

    {/* Sidebar */}
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      } md:hidden`}
    >
      <button
        className="absolute top-4 left-4 text-gray-600 focus:outline-none"
        onClick={() => setSidebarOpen(false)}
      >
        ✕
      </button>
      <nav className="flex flex-col space-y-4 p-6 pt-20 text-sm font-medium">
        <a href="/signup" className="hover:text-blue-600">Find Talent</a>
        <a href="/signup" className="hover:text-blue-600">Find Work</a>
        <a href="/whyus" className="hover:text-blue-600">Why Us</a>
        <a href="/signin" className="hover:text-blue-600">Sign in</a>
        <a href="/signup" className="hover:text-blue-600">Sign Up</a>
        
      </nav>
    </div>
  </>
  );
}

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <div className="py-12 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Why Choose Us?</h1>
          <p className="text-lg mb-10 text-center text-gray-600">
            We’re more than just a freelance marketplace. We connect talent with opportunity in the most seamless, trusted way possible.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-gray-100 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Trusted Platform</h2>
              <p className="text-sm text-gray-600">
                Every user is vetted. From ID verification to reviews — we ensure trust from both clients and freelancers.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Smart Matching</h2>
              <p className="text-sm text-gray-600">
                Our algorithm connects clients with freelancers based on skills, ratings, and real-time availability.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Secure Payments</h2>
              <p className="text-sm text-gray-600">
                Escrow-backed payments and milestone tracking protect both sides, ensuring fairness and safety.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
            >
              Join Us Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}