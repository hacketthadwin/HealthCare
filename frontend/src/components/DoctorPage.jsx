import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const DoctorPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [patients, setPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPatient, setChatPatient] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [myScheduledAppointments] = useState([]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || "User");
    } catch {
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/appointments/doctorappointment",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Doctor appointments response:", res.data.data);

      const allAppointments = res.data.data;
      const pending = allAppointments.filter(app => app.status === 'pending');
      const accepted = allAppointments.filter(app => app.status === 'accepted' || app.status === 'completed');

      const formattedPendingRequests = pending.map(app => ({
        id: app._id,
        patient: app.patientId?.name || "Unknown Patient",
        reason: app.reason,
        date: new Date(app.appointmentDate).toLocaleDateString(),
        time: new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalApp: app
      }));

      const formattedPatientList = accepted.map(app => ({
        id: app._id,
        name: app.patientId?.name || "Unknown Patient",
        symptoms: app.reason,
        status: app.status
      }));

      setPendingRequests(formattedPendingRequests);
      setPatients(formattedPatientList);

    } catch (err) {
      console.error("Fetch error response:", err.response);
      console.error("Fetch error message:", err.message);
      toast.error("Error loading appointments");
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const token = localStorage.getItem("userToken");
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/appointments/${appointmentId}`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment cancelled successfully!");
      fetchAppointments();
    } catch (err) {
      console.error("Cancellation error:", err.response?.data || err.message);
      toast.error("Failed to cancel appointment.");
    }
  };

  const handleRequest = async (appointmentId, action) => {
    const token = localStorage.getItem("userToken");
    try {
      const newStatus = action === "accept" ? "accepted" : "rejected";
      await axios.patch(
        `http://localhost:5000/api/v1/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${action}ed successfully!`);
      fetchAppointments();
    } catch (err) {
      console.error("Request handling error:", err.response?.data || err.message);
      toast.error(`Failed to ${action} appointment.`);
    }
  };

  return (
    <div className="min-h-screen bg-custom-gradient py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">Welcome, {userName}!</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/community-support")}
            className="px-6 py-2 bg-neon-green text-black font-bold rounded-md hover:bg-black hover:text-white focus:ring-2 focus:ring-neon-green focus:ring-offset-2 transition-all duration-300"
          >
            Community Support
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="col-span-1 bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-[400px] transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📆 Calendar</h2>
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            prevLabel="‹"
            nextLabel="›"
            calendarType="gregory"
            locale="en-US"
            className="rounded-md bg-white/50 backdrop-blur-md"
          />
        </div>

        {/* My Scheduled Appointments */}
        <div className="col-span-1 bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-6 h-[400px] overflow-auto transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 My Scheduled Appointments</h2>
          <ul className="space-y-4">
            {myScheduledAppointments.map(app => (
              <li key={app.id} className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <p className="font-medium text-gray-900">Appointment with {app.patient} at {app.time}</p>
                </div>
                <button
                  onClick={() => cancelAppointment(app.id)}
                  className="text-red-600 hover:text-red-700 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </li>
            ))}
            {myScheduledAppointments.length === 0 && (
              <p className="text-gray-600 text-center py-4">No upcoming appointments.</p>
            )}
          </ul>
        </div>

        {/* Appointment Requests */}
        <div className="col-span-1 bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-6 h-[400px] overflow-auto transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📨 Appointment Requests</h2>
          <ul className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No new appointment requests.</p>
            ) : (
              pendingRequests.map(req => (
                <li
                  key={req.id}
                  className="p-4 bg-gray-100/50 backdrop-blur-sm rounded-md flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold text-gray-900">Patient: {req.patient}</p>
                    <p className="text-sm text-gray-600">Reason: {req.reason}</p>
                    <p className="text-sm text-gray-600">Date: {req.date}</p>
                    <p className="text-sm text-gray-600">Time: {req.time}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRequest(req.id, "accept")}
                      className="px-4 py-1 bg-neon-green text-black font-medium rounded-md hover:bg-black hover:text-white focus:ring-2 focus:ring-neon-green focus:ring-offset-2 transition-all duration-300"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequest(req.id, "reject")}
                      className="px-4 py-1 bg-red-500/50 backdrop-blur-sm text-red-800 font-medium rounded-md hover:bg-red-600/50 transition-all duration-300"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Patient List */}
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-6 h-[300px] overflow-auto transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🩺 Patient Lists (Accepted)</h2>
        <ul className="space-y-4">
          {patients.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No accepted patient appointments found.</p>
          ) : (
            patients.map((p) => (
              <li key={p.id} className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-600">Symptoms: {p.symptoms}</p>
                  <p className="text-sm text-gray-600">Status: {p.status}</p>
                </div>
                <button
                  onClick={() => { setChatPatient(p); setChatOpen(true); }}
                  className="text-blue-800 hover:text-blue-900 font-medium transition-all duration-200"
                >
                  Chat
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat Drawer */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end">
          <div className="bg-white/50 backdrop-blur-md w-full md:w-1/3 h-full z-30 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200/50">
              <h3 className="font-bold text-gray-900">Chat with {chatPatient.name}</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-red-600 hover:text-red-700 font-bold text-lg transition-all duration-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-3">
                <p className="self-start bg-gray-100/50 backdrop-blur-sm p-3 rounded-md text-gray-900">Hello Doctor!</p>
                <p className="self-end bg-blue-100/50 backdrop-blur-sm p-3 rounded-md text-gray-900">Hi, how can I help?</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200/50 flex">
              <input
                type="text"
                className="flex-1 border-none bg-white/50 p-2 rounded-l-md text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-all duration-200"
                placeholder="Type a message..."
              />
              <button
                className="bg-neon-green text-black font-medium px-4 rounded-r-md hover:bg-black hover:text-white focus:ring-2 focus:ring-neon-green focus:ring-offset-2 transition-all duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;