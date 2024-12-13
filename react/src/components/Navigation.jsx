import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import { useAppContext } from "../context/AppContext";


export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use AppContext for user and API handlers
  const { user, loading, api } = useAppContext();

  // Scrolls smoothly to a specific section by ID
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };


  // Login and Logout Functions
  const login = () => {
    window.location.href = `/oauth2/authorization/okta`;
  };

  const logout = async () => {
    try {
      const result = await api.post("/logout");
      window.location.href = `${result.logoutUrl}?id_token_hint=${result.idToken}&post_logout_redirect_uri=${window.location.origin}`;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center p-4 px-10 h-[80px] bg-gray-100 dark:bg-gray-900 shadow-md">
        {/* Logo - Navigates to the home page */}
        <p
          className="text-3xl font-bold cursor-pointer text-textDark dark:text-textLight"
          onClick={() => navigate("/")}
        >
          {location.pathname === "/admin" ? "York Medical Admin" : "York Medical"}
        </p>

        {/* Dashboard Buttons */}
        {location.pathname === "/dashboard" && (
          <div className="flex gap-4">
            <button
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={() => scrollToSection("appointments")}
            >
              Appointments
            </button>
            <button
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={() => scrollToSection("help")}
            >
              Assistance
            </button>
          </div>
        )}

        {/*  Login/Logout Button */}
        <div className="flex gap-4">
          {loading ? (
            <button
              className="px-6 py-1 font-semibold text-white bg-blue-600 rounded-lg shadow-lg"
              disabled
            >
              Loading...
            </button>
          ) : user ? (
            <button
              className="px-6 py-1 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={logout}
            >
              Log Out
            </button>
          ) : (
            <button
              className="px-6 py-1 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={login}
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
