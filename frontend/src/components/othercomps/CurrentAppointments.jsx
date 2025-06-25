import React, { useState, useEffect, useRef } from 'react';

// Helper function to format date and time for display
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    weekday: 'short', // Mon, Tue
    month: 'short', // Jan, Feb
    day: 'numeric', // 1, 2
    hour: 'numeric', // 1, 2
    minute: '2-digit', // 01, 02
    hour12: true, // AM/PM
  };
  return date.toLocaleDateString('en-US', options);
};

function CurrentAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
    //   const simulatedAppointments = generateSimulatedAppointments();
    //   setAppointments(simulatedAppointments);
      setCurrentIndex(0);
    } catch (e) {
      console.error('Error fetching appointments:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

//   const generateSimulatedAppointments = () => {
//     const now = new Date();
//     const futureAppointments = [];
//     const appt1Time = new Date(now.getTime() + 60 * 60 * 1000);
//     futureAppointments.push({
//       id: 'appt-123',
//       provider: 'Dr. Smith',
//       type: 'Follow-up',
//       dateTime: appt1Time.toISOString(),
//       link: 'https://meet.google.com/abc-xyz-123',
//     });
//     const appt2Time = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate() + 1,
//       9,
//       30
//     );
//     futureAppointments.push({
//       id: 'appt-456',
//       provider: 'Dr. Jones',
//       type: 'Consultation',
//       dateTime: appt2Time.toISOString(),
//       link: 'https://zoom.us/j/1234567890',
//     });
//     const appt3Time = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate() + 7,
//       14,
//       0
//     );
//     futureAppointments.push({
//       id: 'appt-789',
//       provider: 'Therapist Green',
//       type: 'Therapy Session',
//       dateTime: appt3Time.toISOString(),
//       link: 'https://teams.microsoft.com/l/meetup-join/...',
//     });
//     return futureAppointments.filter((appt) => new Date(appt.dateTime) > now);
//   };

  useEffect(() => {
    fetchAppointments();
    intervalRef.current = setInterval(fetchAppointments, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(appointments.length - 1, prevIndex + 1)
    );
  };

  const currentAppointment = appointments[currentIndex];

  if (loading) {
    return (
      <div
        className="w-full max-w-lg mx-auto my-4 p-4 sm:p-6 rounded-lg text-center text-white
                    bg-white/20 backdrop-blur-md"
      >
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full max-w-lg mx-auto my-4 p-4 sm:p-6 rounded-lg text-center text-rose-500
                    bg-white/20 backdrop-blur-md"
      >
        Error: {error.message}
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-lg mx-auto my-4 p-4 sm:p-6 rounded-lg
                  bg-white/20 backdrop-blur-md text-white text-left h-[16rem]"
    >
      <h2
        className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-left"
      >
        Your Upcoming Appointments
      </h2>
      {appointments.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-full sm:w-auto text-white bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-500 
                         disabled:opacity-50 transition-colors duration-200 text-sm sm:text-base"
            >
              ⬅ Previous
            </button>
            <span className="text-white text-sm sm:text-base">
              {currentIndex + 1} / {appointments.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === appointments.length - 1}
              className="w-full sm:w-auto text-white bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-500 
                         disabled:opacity-50 transition-colors duration-200 text-sm sm:text-base"
            >
              Next ➡
            </button>
          </div>

          {currentAppointment && (
            <div className="border-b border-white/30 pb-4 last:border-b-0 last:pb-0">
              <p className="text-base sm:text-lg font-semibold text-white break-words">
                {currentAppointment.type} with {currentAppointment.provider}
              </p>
              <p className="text-white/80 text-sm sm:text-base break-words">
                <span className="font-medium">When:</span>{' '}
                {formatDateTime(currentAppointment.dateTime)}
              </p>
              {currentAppointment.link && (
                <a
                  href={currentAppointment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold 
                             py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm sm:text-base 
                             uppercase tracking-wide"
                >
                  Join Appointment
                </a>
              )}
              {!currentAppointment.link && (
                <p className="text-white/60 text-xs sm:text-sm italic mt-2">
                  No direct link available.
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-white/70 text-sm sm:text-base">
          You have no upcoming appointments.
        </p>
      )}
    </div>
  );
}

export default CurrentAppointments;