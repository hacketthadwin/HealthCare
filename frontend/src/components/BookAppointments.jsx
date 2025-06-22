import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const doctorsList = [
  { id: 1, name: 'Dr. Aarti Singh', specialty: 'Cardiologist' },
  { id: 2, name: 'Dr. Rohit Patel', specialty: 'Dermatologist' },
  { id: 3, name: 'Dr. Meera Rao', specialty: 'Pediatrician' },
];

const BookAppointments = () => {
  const [reasons, setReasons] = useState({});

  const handleReasonChange = (id, value) => {
    setReasons(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBook = (doctor) => {
    const reason = reasons[doctor.id] || 'No reason provided';
    // handle booking logic here
    console.log(`Booking appointment with ${doctor.name}. Reason: ${reason}`);
    toast.success(`Requested appointment with ${doctor.name}!`, {
      duration: 4000,
      position: 'top-right',
      style: {
        border: '1px solid #4B5563',
        padding: '16px',
        color: '#111827',
      },
      icon: '🩺',
      iconTheme: {
        primary: '#2563EB',
        secondary: '#FFF',
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Toast container */}
      <Toaster />

      <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
      <div className="space-y-6">
        {doctorsList.map(doctor => (
          <div key={doctor.id} className="flex items-start space-x-4 p-4 border rounded-lg">
            {/* Sample image placeholder */}
            <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0" />

            <div className="flex-1">
              <h3 className="text-xl font-medium">{doctor.name}</h3>
              <p className="text-gray-600 mb-2">{doctor.specialty}</p>

              <label className="block mb-1 text-sm font-medium" htmlFor={`reason-${doctor.id}`}>Why you want to book appointment:</label>
              <textarea
                id={`reason-${doctor.id}`}
                className="w-full border rounded-md p-2 mb-3"
                rows={2}
                placeholder="Enter your reason..."
                value={reasons[doctor.id] || ''}
                onChange={(e) => handleReasonChange(doctor.id, e.target.value)}
              />

              <button
                onClick={() => handleBook(doctor)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointments;
