import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialtiesBanner from '../components/Home Components/SpecialtiesBanner';
import Stats from '../components/Home Components/Stats';

function Home() {
  const navigate = useNavigate();

  const login = () => {
    window.location.href = `/oauth2/authorization/okta`;
  };

  return (
    <div className="h-full bg-backgroundLight dark:bg-backgroundDark">
      {/* Hero Section */}
      <div className="flex flex-col items-center px-6 py-16 text-center bg-backgroundLight dark:bg-backgroundDark">
        {/* Hero Title */}
        <h2 className="mb-4 text-3xl font-bold text-blue-800 dark:text-white md:text-5xl">
          Feel Better. Live Better.
        </h2>
        
        {/* Hero Subtitle */}
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-6 max-w-[600px]">
          Don’t let health concerns hold you back. Take the first step toward a healthier, more vibrant life with our expert care.
        </p>

        {/* Call-to-Action Button */}
        <button 
          onClick={() => login()}
          className="px-6 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          See a Doctor Now
        </button>
      </div>

      {/* Specialties Banner */}
      <SpecialtiesBanner />

      {/* Stats Section */}
      {/* Displays statistical data like number of doctors, patients, and specialties */}
      <div className="flex flex-row justify-center p-12">
        <Stats />
      </div>
    </div>
  );
}

export default Home;
