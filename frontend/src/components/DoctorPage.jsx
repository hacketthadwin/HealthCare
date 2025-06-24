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
  const [patients, setPatients] = useState([]); // This will now typically hold accepted/confirmed appointments
  const [pendingRequests, setPendingRequests] = useState([]); // To store pending appointment requests
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPatient, setChatPatient] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Dummy appointments - these should ideally come from backend and be filtered
  // Keeping them for now if 'My Appointments' section is meant for something else
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

      // Filter appointments into pending requests and accepted patients
      const pending = allAppointments.filter(app => app.status === 'pending');
      const accepted = allAppointments.filter(app => app.status === 'accepted' || app.status === 'completed'); // Or just 'accepted'

      // Format pending requests for display
      const formattedPendingRequests = pending.map(app => ({
        id: app._id,
        patient: app.patientId?.name || "Unknown Patient", // Ensure patientId is populated
        reason: app.reason,
        date: new Date(app.appointmentDate).toLocaleDateString(), // Assuming you have appointmentDate
        time: new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalApp: app // Keep original object for accept/reject
      }));

      // Format patient list for display
      const formattedPatientList = accepted.map(app => ({
        id: app._id,
        name: app.patientId?.name || "Unknown Patient",
        symptoms: app.reason,
        status: app.status // Include status for clarity in patient list
      }));

      setPendingRequests(formattedPendingRequests);
      setPatients(formattedPatientList);

    } catch (err) {
      console.error("Fetch error response:", err.response);
      console.error("Fetch error message:", err.message);
      toast.error("Error loading appointments");
      // If error is due to expired token, log out
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchAppointments(); // Initial fetch
  }, [navigate]); // Depend on navigate

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const token = localStorage.getItem("userToken");
    try {
      // Assuming you want to change status to 'cancelled' or similar
      await axios.patch(
        `http://localhost:5000/api/v1/appointments/${appointmentId}`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment cancelled successfully!");
      fetchAppointments(); // Re-fetch to update the lists
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
      fetchAppointments(); // Re-fetch to update the lists (move from requests to patients or disappear)
    } catch (err) {
      console.error("Request handling error:", err.response?.data || err.message);
      toast.error(`Failed to ${action} appointment.`);
    }
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

        {/* My Appointments (Consider populating this from backend if it represents scheduled future appointments specific to the doctor's available slots) */}
        {/* For now, this is using the static `myScheduledAppointments` state.
            You might want to filter 'accepted' appointments from your backend data here. */}
        <div className="col-span-1 bg-white rounded-xl shadow-lg p-4 h-[400px] overflow-auto">
          <h2 className="text-xl font-semibold mb-3">📅 My Scheduled Appointments</h2>
          <ul className="space-y-2">
            {myScheduledAppointments.map(app => ( // Replace with 'patients' state if it holds future accepted appointments
              <li key={app.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Appointment with {app.patient} at {app.time}</p>
                </div>
                <button
                  onClick={() => cancelAppointment(app.id)}
                  className="text-red-600 hover:underline"
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

        {/* Appointment Requests (Now populated from pendingRequests state) */}
        <div className="col-span-1 bg-white rounded-xl shadow-lg p-4 h-[400px] overflow-auto">
          <h2 className="text-xl font-semibold mb-3">📨 Appointment Requests</h2>
          <ul className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No new appointment requests.</p>
            ) : (
              pendingRequests.map(req => (
                <li
                  key={req.id}
                  className="border p-2 rounded-md bg-gray-50 flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold">Patient: {req.patient}</p>
                    <p className="text-sm">Reason: {req.reason}</p>
                    <p className="text-sm">Date: {req.date}</p>
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
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Patient List (Now explicitly showing accepted/completed patients) */}
      <div className="w-full max-w-6xl mt-6 bg-white rounded-xl shadow-lg p-4 h-[300px] overflow-auto">
        <h2 className="text-xl font-semibold mb-3">🩺 Patient Lists (Accepted)</h2>
        <ul className="space-y-2">
          {patients.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No accepted patient appointments found.</p>
          ) : (
            patients.map((p) => (
              <li key={p.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-gray-500">Symptoms: {p.symptoms}</p>
                  <p className="text-sm text-gray-500">Status: {p.status}</p> {/* Display status */}
                </div>
                <button
                  onClick={() => { setChatPatient(p); setChatOpen(true); }}
                  className="text-blue-500 hover:underline"
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
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 flex justify-end">
          <div className="bg-white w-full md:w-1/3 h-full z-30 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">Chat with {chatPatient.name}</h3>
              <button onClick={() => setChatOpen(false)} className="text-red-500">✕</button>
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