import React, { useState } from "react";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b">
        <a href="/">
          <h1 className="text-xl font-bold">MyJob.ma</h1>
        </a>
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
          <a href="/signin" className="hover:text-blue-600">Sign in</a>
          <a href="/signup" className="hover:text-blue-600">Sign up</a>
        </nav>
      </header>

      {/* Mobile Sidebar */}
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
          <a href="/signup" className="hover:text-blue-600">Sign up</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
