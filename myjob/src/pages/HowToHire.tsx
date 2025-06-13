import React from "react";
import { useState } from "react";

export function HowToHire() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="  max-w-7xl mx-auto">
        {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b">
        <a href="/"><h1 className="text-xl font-bold">MyJob.ma</h1></a>
        <button
          className="md:hidden text-blue-600 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="/signup" className="hover:text-blue-600">Find Talent</a>
          <a href="/signup" className="hover:text-blue-600">Find Work</a>
          <a href="/whyus" className="hover:text-blue-600">Why Us</a>
          <a href="signin" className="hover:text-blue-600">Sign in</a>
          <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
                >
                Sign Up
                </a>
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
      {/* Hero Section */}
      <section className="px-6 text-center mb-16 mt-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">How to Hire the Right Talent</h1>
        <p className="text-lg text-gray-600">
          Easily find, vet, and hire professionals from our global network in just a few steps.
        </p>
      </section>

      {/* Steps Section */}
      <div className="px-6 grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
            alt="Hiring process"
            className="rounded-3xl shadow-xl"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">The Hiring Journey</h2>
          <ol className="list-decimal list-inside text-gray-700 text-base space-y-4">
            <li><strong>Create an account:</strong> Sign up in minutes, it's completely free.</li>
            <li><strong>Post your job:</strong> Include project details, timeline, and budget.</li>
            <li><strong>Review applicants:</strong> Evaluate proposals and browse top-rated freelancers.</li>
            <li><strong>Interview candidates:</strong> Chat or schedule calls to find the right fit.</li>
            <li><strong>Hire and collaborate:</strong> Use our tools to manage the project securely.</li>
            <li><strong>Pay confidently:</strong> Set milestones and pay through secure escrow.</li>
          </ol>
        </div>
      </div>

      {/* Features Section */}
      <section className="mx-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-10 rounded-2xl shadow-inner mb-20">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Why Clients Choose Us</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-800 text-base">
          <div className="flex items-start">
            <span className="text-indigo-500 font-bold mr-2">✓</span>
            Work with vetted professionals across industries and skills.
          </div>
          <div className="flex items-start">
            <span className="text-indigo-500 font-bold mr-2">✓</span>
            Transparent pricing and no surprise charges.
          </div>
          <div className="flex items-start">
            <span className="text-indigo-500 font-bold mr-2">✓</span>
            Project tracking tools and real-time updates.
          </div>
          <div className="flex items-start">
            <span className="text-indigo-500 font-bold mr-2">✓</span>
            Escrow-secured payments for trust and peace of mind.
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center py-12 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Find the Perfect Freelancer?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          With our streamlined hiring process and extensive talent pool, it's never been easier to hire top professionals for your project needs.
        </p>
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Post a Job for Free
        </a>
      </div>
    </div>
  );
}
