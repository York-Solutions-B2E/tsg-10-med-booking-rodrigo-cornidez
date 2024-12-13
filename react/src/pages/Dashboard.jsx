import WelcomeMessage from "../components/Dashboard Components/WelcomeMessage";
import HelpScheduling from "../components/Dashboard Components/HelpScheduling";
import AppointmentHandler from "../components/Dashboard Components/AppointmentHandler";

const Dashboard = () => {
  return (
    <div className="h-full bg-backgroundLight dark:bg-backgroundDark">
      {/* Welcome Message */}
      <WelcomeMessage />

      {/* Appointment Management Handler */}
      <div className="pt-8 bg-gray-100 dark:bg-gray-900">
        <AppointmentHandler/>
      </div>

      {/* Help Scheduling */}
      <HelpScheduling />
    </div>
  );
};

export default Dashboard;
