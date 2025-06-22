// PatientPage.js
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
  const [refreshChartKey, setRefreshChartKey] = useState(0); // State to force chart re-render
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
    navigate("/book-appointment"); // Navigate to a new route for booking
  };

  // New handler for community support
  const handleCommunitySupport = () => {
    navigate("/community-support"); // Navigate to a new route for community support
  };

  // Callback function to be passed to DailyTaskLog, which will then trigger chart refresh
  const triggerChartRefresh = useCallback(() => {
    setRefreshChartKey(prevKey => prevKey + 1);
  }, []);
  

  return (
    <div className="min-h-screen bg-green-200 p-4">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userName}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out mr-5"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Daily Task Completion Chart - Use key prop for re-render strategy */}
        <DailyTaskCompletionChart key={refreshChartKey} />

        {/* Daily Task Log - Pass the refresh callback */}
        <DailyTaskLog onTaskUpdate={triggerChartRefresh} />
      </div>

      {/* Current Appointments Section and Buttons */}
<div className='ml-0 sm:ml-5 my-5 flex items-start gap-4'>
        <CurrentAppointments />
        <div className="flex flex-col gap-4 mt-10"> {/* New div to stack buttons vertically */}
          <button
            onClick={handleBookAppointment}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Book New Appointment
          </button>
          {/* CORRECTED CODE FOR THIS BUTTON BELOW */}
          <button
            onClick={handleCommunitySupport} // Correct: attribute is inside the opening tag
            className="bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Community Support
          </button>
        </div>
      </div>
      <AIChatButton /> {/* <-- Render the AI chat component here */}
    </div>
  );
};

export default PatientPage;