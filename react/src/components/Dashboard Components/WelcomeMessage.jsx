import React from "react";
import { useAppContext } from "../../context/AppContext"; // Import AppContext hook

/**
 * Displays a personalized greeting message based on the time of day.
 * The message dynamically changes to "Good Morning", "Good Afternoon", or "Good Evening".
 *
 * @component
 * @returns {JSX.Element} The WelcomeMessage component.
 */
export default function WelcomeMessage() {
  const { user } = useAppContext(); // Retrieve user data from context
  const firstName = user?.given_name;

  /**
   * Determines the appropriate greeting based on the current time.
   * If `firstName` is null, empty, or invalid, it excludes the name.
   * @returns {string} A greeting message.
   */
  const getTimeOfDayMessage = () => {
    const hours = new Date().getHours();
    const baseGreeting =
      hours < 12
        ? "Good Morning"
        : hours < 18
        ? "Good Afternoon"
        : "Good Evening";

    // Append name only if firstName is valid
    return firstName && firstName.trim().length > 0
      ? `${baseGreeting}, ${firstName}!`
      : `${baseGreeting}!`;
  };

  return (
    <section
      id="appointments"
      className="pt-12 pb-4 bg-gray-100 dark:bg-gray-900"
    >
      <div className="container px-4 mx-auto md:px-8 lg:px-16">
        {/* Displays the greeting message */}
        <h1 className="text-3xl font-bold text-left text-gray-800 dark:text-white">
          {getTimeOfDayMessage()}
        </h1>
      </div>
    </section>
  );
}
