import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [patients] = useState([
    { name: "John Doe", symptoms: "Fever", id: 1 },
    { name: "Alice Smith", symptoms: "Cough", id: 2 },
  ]);
  const [appointments, setAppointments] = useState([
    { id: 1, time: "09:00 AM" },
    { id: 2, time: "11:30 AM" },
    { id: 3, time: "03:00 PM" },
  ]);
  const [requests, setRequests] = useState([
    { id: 1, patient: "Ankit Sharma", time: "04:00 PM" },
    { id: 2, patient: "Priya Verma", time: "05:30 PM" },
  ]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatPatient, setChatPatient] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User");
      } catch (err) {
        localStorage.clear();
        navigate("/login");
      }
    } else {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cancelAppointment = (id) => {
    setAppointments(a => a.filter(app => app.id !== id));
    toast.info("Appointment cancelled");
  };

  const handleRequest = (id, action) => {
    setRequests(r => r.filter(req => req.id !== id));
    toast.success(`Request ${action}ed`);
  };

  return (
    <div className="min-h-screen bg-green-200 px-4 py-6 flex flex-col items-center relative">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Welcome, {userName}!</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/community-support")}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Community Support
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="col-span-1 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center h-[400px]">
          <h2 className="text-xl font-semibold mb-3">📆 Calendar</h2>
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            prevLabel="‹"
            nextLabel="›"
            calendarType="gregory"
            locale="en-US"
          />
        </div>

        {/* My Appointments */}
        <div className="col-span-1 bg-white rounded-xl shadow-lg p-4 h-[400px] overflow-auto">
          <h2 className="text-xl font-semibold mb-3">📅 My Appointments</h2>
          <ul className="space-y-2">
            {appointments.map(app => (
              <li key={app.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Appointment at {app.time}</p>
                </div>
                <button
                  onClick={() => cancelAppointment(app.id)}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Appointment Requests */}
        <div className="col-span-1 bg-white rounded-xl shadow-lg p-4 h-[400px] overflow-auto">
          <h2 className="text-xl font-semibold mb-3">📨 Appointment Requests</h2>
          <ul className="space-y-3">
            {requests.map(req => (
              <li
                key={req.id}
                className="border p-2 rounded-md bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <p className="font-bold">Request #{req.id}</p>
                  <p className="text-sm">Patient: {req.patient}</p>
                  <p className="text-sm">Time: {req.time}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleRequest(req.id, "accept")}
                    className="bg-green-500 text-white text-sm px-2 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(req.id, "reject")}
                    className="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Patient List - Below Grid */}
      <div className="w-full max-w-6xl mt-6 bg-white rounded-xl shadow-lg p-4 h-[300px] overflow-auto">
        <h2 className="text-xl font-semibold mb-3">🩺 Patient Lists</h2>
        <ul className="space-y-2">
          {patients.map(p => (
            <li
              key={p.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-gray-500">Symptoms: {p.symptoms}</p>
              </div>
              <button
                onClick={() => { setChatPatient(p); setChatOpen(true); }}
                className="text-blue-500 hover:underline"
              >
                Chat
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Drawer */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 flex justify-end">
          <div className={`bg-white w-full md:w-1/3 h-full z-30 flex flex-col`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">Chat with {chatPatient.name}</h3>
              <button onClick={() => setChatOpen(false)} className="text-red-500">
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-2">
                <p className="self-start bg-gray-200 p-2 rounded">Hello Doctor!</p>
                <p className="self-end bg-blue-200 p-2 rounded">Hi, how can I help?</p>
              </div>
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                className="flex-1 border px-2 py-1 rounded-l"
                placeholder="Type a message..."
              />
              <button className="bg-green-500 text-white px-4 rounded-r">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
