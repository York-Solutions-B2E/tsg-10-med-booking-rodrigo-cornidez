import React, { useState, useEffect } from "react";
import DoctorHandler from "../components/Admin Components/DoctorHandler";
import SpecialtyHandler from "../components/Admin Components/SpecialtyHandler";

function Admin() {
  const [activeTab, setActiveTab] = useState("doctors");

  return (
    <section className="h-full py-12 text-gray-900 bg-gray-100 dark:text-gray-200 dark:bg-gray-900">
      <div className="container px-4 mx-auto md:px-8 lg:px-16">
        {/* Header and Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 font-semibold rounded ${
                activeTab === "doctors"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("doctors")}
            >
              Doctors
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded ${
                activeTab === "specializations"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("specializations")}
            >
              Specializations
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "doctors" && <DoctorHandler />}
        {activeTab === "specializations" && <SpecialtyHandler />}
      </div>
    </section>
  );
}

export default Admin;
