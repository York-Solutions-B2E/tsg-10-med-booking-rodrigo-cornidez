import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Navigation from './components/Navigation';
import { useAppContext } from './context/AppContext';

function App() {
  const { user, loading } = useAppContext();

  // Render loading state globally until user data is fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        {/* Navigation always visible */}
        <Navigation user={user} />

        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          {user?.groups?.includes("Patients") && (
            <Route path="/dashboard" element={<Dashboard />} />
          )}
          {user?.groups?.includes("Admin") && (
            <Route path="/admin" element={<Admin />} />
          )}

          {/* Fallback Route */}
          { user && <Route
            path="*"
            element={
              user ? (
                user.groups?.includes("Patients") ? (
                  <Navigate to="/dashboard" replace />
                ) : user.groups?.includes("Admin") ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />}
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
