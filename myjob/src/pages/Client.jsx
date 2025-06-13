import React from "react";
import { LucideMessageSquare, LucideSettings, LucideClipboardList, LucideBriefcase, LucideUserPlus } from "lucide-react";
import LoggedInHeader from "../components/LoggedInHeader";
import ClientSidebar from "../components/ClientSideBar";



export default function ClientDashboard() {
  const freelancers = [
    { name: "Amina El Fassi", role: "UI/UX Designer", rating: 4.9, hourlyRate: "$40/hr" },
    { name: "Youssef Rahmani", role: "Full Stack Developer", rating: 4.8, hourlyRate: "$50/hr" },
    { name: "Salma Benali", role: "Digital Marketer", rating: 4.7, hourlyRate: "$35/hr" }
  ];

  return (
    <>
    <LoggedInHeader/>
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <ClientSidebar/>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800">Client Dashboard</h1>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 shadow-md font-semibold">+ Post a Job</button>
        </div>

        {/* Job Post Form */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Post a New Job</h2>
          <form className="space-y-5">
            <input type="text" placeholder="Job Title" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <textarea placeholder="Job Description" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="4"></textarea>
            <input type="text" placeholder="Budget" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 font-medium shadow">Submit Job</button>
          </form>
        </section>

        {/* Recommended Freelancers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Rated Freelancers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {freelancers.map((freelancer, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{freelancer.name}</h3>
                  <span className="text-sm text-yellow-500 font-semibold">⭐ {freelancer.rating}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{freelancer.role}</p>
                <p className="text-indigo-600 font-medium mb-4">{freelancer.hourlyRate}</p>
                <button className="text-sm text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 font-semibold w-full">View Profile</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
