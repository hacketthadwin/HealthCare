import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BookAppointments = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all doctors with role: Doctor
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.get(
        'http://localhost:5000/api/v1/book-appointment/users?role=Doctor',
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      const doctors = response.data.data;
      if (!Array.isArray(doctors)) throw new Error('Unexpected response format');
      setDoctorsList(doctors);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch doctors';
      setError(errorMessage);
      setLoading(false);
      console.error('Fetch error details:', err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleReasonChange = (id, value) => {
    setReasons(prev => ({ ...prev, [id]: value }));
  };

  const handleBook = async (doctor) => {
    const reason = reasons[doctor._id]?.trim();
    const token = localStorage.getItem('userToken');

    // Debug logs
    console.log("👨‍⚕️ Booking for doctor:", doctor);
    console.log("🆔 doctor._id:", doctor._id);
    console.log("📝 reason:", reason);
    console.log("🔐 token:", token);

    if (!doctor._id || !reason) {
      toast.error('Missing doctor ID or reason');
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/v1/appointments/book',
        {
          doctorId: doctor._id,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(`Appointment requested with ${doctor.name}`);
      setReasons(prev => ({ ...prev, [doctor._id]: '' }));
    } catch (err) {
      console.error('❌ Booking failed:', err.response?.data || err.message);
      toast.error(err?.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) return <div className="text-center p-4">Loading doctors...</div>;

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        {error}
        <button
          onClick={fetchDoctors}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
      <div className="space-y-6">
        {doctorsList.length === 0 ? (
          <p className="text-gray-600">No doctors available.</p>
        ) : (
          doctorsList.map(doctor => (
            <div key={doctor._id} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-medium">
                  {doctor.name.startsWith('Dr. ') ? doctor.name : `Dr. ${doctor.name}`}
                </h3>
                {doctor.specialty && (
                  <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                )}
                <label className="block mb-1 text-sm font-medium" htmlFor={`reason-${doctor._id}`}>
                  Why you want to book appointment:
                </label>
                <textarea
                  id={`reason-${doctor._id}`}
                  className="w-full border rounded-md p-2 mb-3"
                  rows={2}
                  placeholder="Enter your reason..."
                  value={reasons[doctor._id] || ''}
                  onChange={(e) => handleReasonChange(doctor._id, e.target.value)}
                />
                <button
                  onClick={() => handleBook(doctor)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookAppointments;
