import React from 'react';

/**
 * Creates a horizontally scrolling marquee effect to display a list of items.
 *
 * @component
 * @param {Object[]} items - The list of items to display in the marquee (each item has an icon and specialty).
 * @returns {JSX.Element} The Marquee component.
 */
function Marquee ({ items }) {
  // Concatenate items for a seamless looping effect
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Container for scrolling items */}
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {marqueeItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center flex-shrink-0 px-6 py-4 mx-2 text-white bg-blue-600 rounded-lg shadow-md"
          >
            {/* Icon */}
            <span className="mr-2 text-2xl">{item.icon}</span>
            {/* Specialty Name */}
            <p className="font-semibold">{item.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
