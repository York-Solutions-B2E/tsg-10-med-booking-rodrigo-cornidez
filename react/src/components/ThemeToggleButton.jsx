import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { Brightness4 as MoonIcon, Brightness7 as SunIcon } from '@mui/icons-material';

/**
 * Provides a button to toggle between light and dark themes.
 * Saves the selected theme in localStorage and updates the HTML root element's class accordingly.
 *
 * @component
 * @returns {JSX.Element} The ThemeToggleButton component.
 */
const ThemeToggleButton = () => {
  // State to track whether dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  /**
   * Effect to apply the theme changes when `isDarkMode` state updates.
   * Adds or removes the 'dark' class on the HTML root element and persists the theme in localStorage.
   */
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  /**
   * Toggles the theme between light and dark by updating the `isDarkMode` state.
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      className="p-2 transition duration-300 bg-gray-200 rounded-full shadow-md dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {/* Renders the icon based on the current theme */}
      {isDarkMode ? (
        <MoonIcon className="text-blue-500" />
      ) : (
        <SunIcon className="text-yellow-500" />
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
