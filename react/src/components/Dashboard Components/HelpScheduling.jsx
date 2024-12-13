import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import calculateDistance from "../../utilities/calculateDistance";

/**
 * Displays assistance information, operating hours, and an interactive map showing the office location.
 *
 * @component
 * @returns {JSX.Element} The HelpScheduling component.
 */
function HelpScheduling() {
  // Office information
  const address = "5301 E Grant Rd, Tucson, AZ 85712";
  const destinationLat = 32.2524806;
  const destinationLng = -110.8800804;

  // State to store the calculated user distance
  const [userDistance, setUserDistance] = useState(null);

  // Refs for managing light and dark maps
  const lightMapRef = useRef(null);
  const darkMapRef = useRef(null);

  /**
   * Initialize both light and dark maps with markers for the office location.
   * Removes maps from the DOM on component unmount.
   */
  useEffect(() => {
    // Initialize Light Map
    lightMapRef.current = L.map("light-map", {
      attributionControl: false,
    }).setView([destinationLat, destinationLng], 16);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(lightMapRef.current);

    L.marker([destinationLat, destinationLng]).addTo(lightMapRef.current);

    // Initialize Dark Map
    darkMapRef.current = L.map("dark-map", {
      attributionControl: false,
    }).setView([destinationLat, destinationLng], 16);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(darkMapRef.current);

    L.marker([destinationLat, destinationLng]).addTo(darkMapRef.current);

    return () => {
      lightMapRef.current.remove();
      darkMapRef.current.remove();
    };
  }, []);


  // Observes theme changes (light/dark mode) to invalidate map sizes and re-render them correctly.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");

      if (isDarkMode) {
        darkMapRef.current.invalidateSize();
      } else {
        lightMapRef.current.invalidateSize();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);


  //Calculates the user's distance to the office using the Haversine formula.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const distance = calculateDistance(
            userLat,
            userLng,
            destinationLat,
            destinationLng
          );
          setUserDistance(distance.toFixed(2));
        },
        () => {
          setUserDistance(null);
        }
      );
    }
  }, []);

  return (
    <section id="help" className="py-12 text-gray-900 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 mx-auto md:px-8 lg:px-16">
        <div className="p-6 bg-white rounded-md shadow-md dark:bg-gray-800">
          {/* Assistance Information */}
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Looking for Assistance?
          </h2>
          <p className="mb-2 text-lg text-gray-800 dark:text-gray-300">
            Whether it's scheduling or questions, we're here for you.
          </p>
          <p className="mb-2 text-lg text-gray-800 dark:text-gray-300">
            Call us at{" "}
            <a href="tel:+15207271463" className="text-blue-600 hover:underline">
              (520) 727-1463
            </a>
          </p>
          <p className="mb-6 text-lg text-gray-800 dark:text-gray-300">
            Or visit us at:{" "}
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {address}
              {userDistance && ` (${userDistance} miles)`}
            </a>
          </p>

          {/* Emergency Note */}
          <p className="inline-block p-2 mb-6 text-lg font-semibold text-white rounded bg-red-500/90">
            If you are experiencing a medical emergency, please call 911 immediately.
          </p>

          {/* Operating Hours */}
          <div className="mb-6 max-w-[500px]">
            <h3 className="pb-2 mb-4 text-xl font-bold text-gray-900 border-b-2 border-gray-200 dark:text-white dark:border-gray-700">
              Operating Hours
            </h3>
            <ul className="space-y-2 text-lg text-gray-800 dark:text-gray-300">
              <li className="flex justify-between pb-1 border-b border-gray-200 dark:border-gray-700">
                <span>Monday - Friday</span>
                <span>8:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-gray-200 dark:border-gray-700">
                <span>Saturday</span>
                <span>9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <div className="relative h-80">
            {/* Light Map */}
            <div id="light-map" className="absolute inset-0 z-10 dark:hidden"></div>

            {/* Dark Map */}
            <div id="dark-map" className="absolute inset-0 z-10 hidden dark:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HelpScheduling;
