import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import DailyTaskCompletionChart from './othercomps/DailyTaskCompletionChart';
import DailyTaskLog from './othercomps/DailyTaskLog';
import CurrentAppointments from './othercomps/CurrentAppointments';
import AIChatButton from './othercomps/AIChatButton';

const PatientPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [refreshChartKey, setRefreshChartKey] = useState(0);
  const [aiTasks, setAiTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User");
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userToken");
        navigate("/login");
      }
    } else {
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleBookAppointment = () => {
    navigate("/book-appointment");
  };

  const handleCommunitySupport = () => {
    navigate("/community-support");
  };

  const triggerChartRefresh = useCallback(() => {
    setRefreshChartKey(prevKey => prevKey + 1);
  }, []);

  return (
    <div className="min-h-screen p-2 sm:p-4 md:px-6 font-sans text-white antialiased
      bg-[radial-gradient(circle_farthest-corner_at_-24.7%_-47.3%,_rgba(6,130,165,1)_0%,_rgba(34,48,86,1)_66.8%,_rgba(15,23,42,1)_100.2%)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center sm:text-left">
          Welcome, {userName}!
        </h1>
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-4 rounded-lg
                     transition duration-300 ease-in-out uppercase tracking-wide text-xs sm:text-sm md:text-base"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 justify-center items-start lg:mt-[-2rem]">
        <DailyTaskCompletionChart key={refreshChartKey} />
        <DailyTaskLog onTaskUpdate={triggerChartRefresh} />
      </div>

      <div className="my-2 sm:my-4 md:my-0 p-2 sm:p-4 md:px-6 md:py-3 rounded-xl
                      bg-white/20 backdrop-blur-md flex flex-col md:flex-row items-start gap-2 sm:gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          <CurrentAppointments />
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 w-full md:w-auto mt-4">
          <button
            onClick={handleBookAppointment}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-1 sm:py-2 px-4 rounded-lg
                       transition duration-300 ease-in-out uppercase tracking-wide text-xs sm:text-sm md:text-base"
          >
            Book New Appointment
          </button>
          <button
            onClick={handleCommunitySupport}
            className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-semibold py-1 sm:py-2 px-4 rounded-lg
                       transition duration-300 ease-in-out uppercase tracking-wide text-xs sm:text-sm md:text-base"
          >
            Community Support
          </button>
        </div>
      </div>

      <AIChatButton />
    </div>
  );
};

export default PatientPage;