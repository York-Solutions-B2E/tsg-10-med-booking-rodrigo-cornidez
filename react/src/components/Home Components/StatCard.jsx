/**
 * Displays a single stat card with a title and count.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the stat (e.g., "Doctors").
 * @param {number} props.count - The numeric value of the stat to display.
 * @returns {JSX.Element} The StatCard component.
 */
function StatCard({ title, count }) {
    return (
      <div className="flex flex-col min-w-[200px] max-w-[260px] items-center justify-center gap-2 p-6 border-2 border-gray-300 rounded-lg shadow-md dark:border-gray-700 bg-backgroundLight dark:bg-backgroundDark">
        {/* Title of the stat */}
        <p className="text-xl font-bold text-gray-800 dark:text-white">{title}</p>
        {/* Count value of the stat */}
        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{count}</p>
      </div>
    );
};

export default StatCard;
  