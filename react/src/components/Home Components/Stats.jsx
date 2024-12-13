import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import roundToSignificant from "../../utilities/roundToSignificant";
import { useAppContext } from "../../context/AppContext";

/**
 * Fetches and displays statistical data in the form of stat cards.
 *
 * @component
 * @returns {JSX.Element} The Stats component.
 */
export default function Stats() {
  const { api } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await api.get("/public/stats");
        setData(result);
      } catch (err) {
        console.error("Error fetching stats:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Render loading message while data is being fetched
  if (loading)
    return (
      <div className="py-6 text-center">
        <p className="text-lg font-medium text-gray-500">Loading stats...</p>
      </div>
    );

  // Render error message if API call fails
  if (error)
    return (
      <div className="py-6 text-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load stats. Please try again.
        </p>
      </div>
    );

  // Round and structure the data for rendering
  const roundedData = data
    ? {
        doctorsCount: roundToSignificant(data.doctorsCount),
        appointmentsCount: roundToSignificant(data.appointmentsCount),
        specializationsCount: roundToSignificant(data.specialtiesCount),
      }
    : null;

  return (
    <div className="flex flex-wrap justify-center gap-6 max-w-[900px]">
      {roundedData ? (
        <>
          {/* Render stat cards if the count is greater than 0 */}
          {roundedData.doctorsCount > 0 && (
            <StatCard title="Doctors" count={roundedData.doctorsCount} />
          )}
          {roundedData.appointmentsCount > 0 && (
            <StatCard title="Patients Helped" count={roundedData.appointmentsCount} />
          )}
          {roundedData.specializationsCount > 0 && (
            <StatCard title="Specializations" count={roundedData.specializationsCount} />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
