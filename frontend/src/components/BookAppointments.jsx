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

    if (!doctor._id) {
      toast.error('Invalid doctor selection');
      return;
    }
    if (!reason) {
      toast.error('Please write a reason');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
        <div className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
        <div className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDoctors}
            className="px-6 py-2 bg-neon-green text-black font-bold rounded-md hover:bg-black hover:text-white transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-gradient py-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Book an Appointment
        </h2>
        <div className="space-y-6">
          {doctorsList.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-800 text-lg">No doctors available.</p>
            </div>
          ) : (
            doctorsList.map(doctor => (
              <div
                key={doctor._id}
                className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {doctor.name.startsWith('Dr. ') ? doctor.name : `Dr. ${doctor.name}`}
                </h3>
                {doctor.specialty && (
                  <p className="text-gray-600 text-sm mb-3">{doctor.specialty}</p>
                )}
                <label
                  className="block mb-1 text-sm font-medium text-gray-800"
                  htmlFor={`reason-${doctor._id}`}
                >
                  Reason for Appointment
                </label>
                <textarea
                  id={`reason-${doctor._id}`}
                  className="w-full border-none rounded-md p-3 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-all duration-200 resize-none bg-white/50"
                  rows={3}
                  placeholder="Describe your reason for the appointment..."
                  value={reasons[doctor._id] || ''}
                  onChange={(e) => handleReasonChange(doctor._id, e.target.value)}
                />
                <button
                  onClick={() => handleBook(doctor)}
                  className="mt-4 px-6 py-2 bg-neon-green text-black font-bold rounded-md hover:bg-black hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                  
                >
                  Book Appointment
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointments;