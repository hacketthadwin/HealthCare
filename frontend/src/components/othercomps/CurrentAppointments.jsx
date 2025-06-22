// src/components/CurrentAppointments.js
import React, { useState, useEffect, useRef } from 'react';

// Helper function to format date and time for display
const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = {
        weekday: 'short', // Mon, Tue
        month: 'short',   // Jan, Feb
        day: 'numeric',   // 1, 2
        hour: 'numeric',  // 1, 2
        minute: '2-digit',// 01, 02
        hour12: true      // AM/PM
    };
    return date.toLocaleDateString('en-US', options);
};

function CurrentAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            // =========================================================================
            // >>>>>>>>>> YOUR ACTUAL API CALL FOR FETCHING APPOINTMENTS GOES HERE <<<<<<<<<<
            // =========================================================================
            // When you integrate your backend:
            // 1. Uncomment the 'const token' line if your API needs authentication.
            // 2. Replace the 'generateSimulatedAppointments()' call with a real fetch.
            //    Example:
            //    const token = localStorage.getItem('userToken'); // Get user's token
            //    const API_URL = `/api/appointments/current`; // Or /api/appointments?status=upcoming
            //    const response = await fetch(API_URL, {
            //      headers: {
            //        'Content-Type': 'application/json',
            //        'Authorization': `Bearer ${token}` // Include token for authentication
            //      }
            //    });
            //    if (!response.ok) {
            //      const errorData = await response.json();
            //      throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
            //    }
            //    const apiData = await response.json(); // This will be your actual data from the server
            //    setAppointments(apiData);
            // =========================================================================

            // --- START: Dummy Data Generation for Demonstration ---
            const simulatedAppointments = generateSimulatedAppointments();
            setAppointments(simulatedAppointments);
            // --- END: Dummy Data Generation ---

        } catch (e) {
            console.error("Error fetching appointments:", e);
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    // Helper to generate dummy appointment data
    const generateSimulatedAppointments = () => {
        const now = new Date();
        const futureAppointments = [];

        // Example: Appointment today in 1 hour
        // const appt1Time = new Date(now.getTime() + 60 * 60 * 1000);
        // futureAppointments.push({
        //     id: 'appt-123',
        //     provider: 'Dr. Smith',
        //     type: 'Follow-up',
        //     dateTime: appt1Time.toISOString(),
        //     link: 'https://meet.google.com/abc-xyz-123'
        // });

        // // Example: Appointment tomorrow morning
        // const appt2Time = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 30);
        // futureAppointments.push({
        //     id: 'appt-456',
        //     provider: 'Dr. Jones',
        //     type: 'Consultation',
        //     dateTime: appt2Time.toISOString(),
        //     link: 'https://zoom.us/j/1234567890'
        // });

        // // Example: Appointment next week
        // const appt3Time = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 14, 0);
        // futureAppointments.push({
        //     id: 'appt-789',
        //     provider: 'Therapist Green',
        //     type: 'Therapy Session',
        //     dateTime: appt3Time.toISOString(),
        //     link: 'https://teams.microsoft.com/l/meetup-join/...'
        // });

        // Filter out appointments that are already in the past (e.g., if you opened the page late)
        return futureAppointments.filter(appt => new Date(appt.dateTime) > now);
    };

    useEffect(() => {
        fetchAppointments(); // Initial fetch

        // Refresh appointments every 5 minutes (or adjust as needed)
        intervalRef.current = setInterval(fetchAppointments, 5 * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-700">
                Loading appointments...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-red-600">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="w-full max-w-md my-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Upcoming Appointments</h2>
            {appointments.length > 0 ? (
                <ul className="space-y-4">
                    {appointments.map(appt => (
                        <li key={appt.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <p className="text-lg font-semibold text-gray-700">{appt.type} with {appt.provider}</p>
                            <p className="text-gray-600">
                                <span className="font-medium">When:</span> {formatDateTime(appt.dateTime)}
                            </p>
                            {appt.link && (
                                <a
                                    href={appt.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300 ease-in-out text-sm"
                                >
                                    Join Appointment
                                </a>
                            )}
                            {!appt.link && (
                                <p className="text-gray-500 text-sm italic mt-2">No direct link available.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">You have no upcoming appointments.</p>
            )}
        </div>
    );
}

export default CurrentAppointments;