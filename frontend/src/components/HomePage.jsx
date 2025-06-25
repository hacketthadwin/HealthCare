import React, { useEffect, useRef ,useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate only, no BrowserRouter here
import ReactPlayer from 'react-player/youtube';
import Chart from 'chart.js/auto'; // Ensure Chart.js is imported for use

// The main content of the Home Page component
const HomePage = () => { // Renamed from AppContent to HomePage
  const navigate = useNavigate(); // Initialize useNavigate
  const playerRef = useRef(null);

  useEffect(() => {
    const tryUnmute = setTimeout(() => {
      try {
        playerRef.current?.getInternalPlayer()?.unMute?.(); // Only works if browser allows
      } catch (err) {
        console.warn('Auto unmute failed:', err);
      }
    }, 1000); // Give it 1s after play starts

    return () => clearTimeout(tryUnmute);
  }, []);

  // Function to create a Chart.js instance with neon colors and styling
  // This is a helper function to avoid repetition and ensure consistent styling
  const createStyledChart = (canvasRef, type, data, options) => {
    if (canvasRef.current) { // Removed '&& window.Chart' check
      // Destroy existing chart instance if it exists to prevent re-renders issues
      if (canvasRef.current.chart) {
        canvasRef.current.chart.destroy();
      }
      // Create new chart instance
      canvasRef.current.chart = new Chart(canvasRef.current, {
        type: type,
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow charts to fill container
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.9)', // Neon text for legend
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.7)',
              titleColor: 'rgba(255,255,255,1)',
              bodyColor: 'rgba(255,255,255,0.9)',
              borderColor: 'rgba(0,255,255,0.8)', // Neon border
              borderWidth: 1,
              cornerRadius: 8,
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'rgba(0, 255, 255, 0.8)', // Neon cyan for x-axis labels
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 255, 255, 0.2)', // Faint neon grid lines
                borderColor: 'rgba(0, 255, 255, 0.5)',
              }
            },
            y: {
              ticks: {
                color: 'rgba(255, 0, 255, 0.8)', // Neon magenta for y-axis labels
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(255, 0, 255, 0.2)', // Faint neon grid lines
                borderColor: 'rgba(255, 0, 255, 0.5)',
              }
            }
          },
          ...options, // Merge custom options
        },
      });
    }
  };


  // ChartLine component logic
  const chartLineCanvasRef = useRef(null);
  useEffect(() => {
    const lineChartData = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      datasets: [
        {
          label: 'Patient Recovery Progress',
          data: [10, 25, 40, 60, 75, 90, 100], // Hypothetical recovery data
          borderColor: 'rgba(50, 205, 50, 1)', // Bright Green Neon
          backgroundColor: 'rgba(50, 205, 50, 0.2)',
          tension: 0.4, // Smooth line
          pointBackgroundColor: 'rgba(50, 205, 50, 1)',
          pointBorderColor: 'rgba(255, 255, 255, 0.8)',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
    createStyledChart(chartLineCanvasRef, 'line', lineChartData); // Use the styled chart creator

    return () => {
      if (chartLineCanvasRef.current && chartLineCanvasRef.current.chart) {
        chartLineCanvasRef.current.chart.destroy();
      }
    };
  }, []); // Empty dependency array means this runs once on mount


  // ChartBar component logic
  const chartBarCanvasRef = useRef(null);
  useEffect(() => {
    const barChartData = {
      labels: ['OPD', 'Emergency', 'Surgery', 'ICU'],
      datasets: [{
        label: 'Visits',
        data: [300, 450, 200, 100],
        backgroundColor: [
            'rgba(255, 0, 255, 0.7)', // Neon Magenta
            'rgba(0, 255, 255, 0.7)', // Neon Cyan
            'rgba(255, 215, 0, 0.7)', // Gold Neon
            'rgba(50, 205, 50, 0.7)', // Lime Green Neon
        ],
        borderColor: [
            'rgba(255, 0, 255, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(255, 215, 0, 1)',
            'rgba(50, 205, 50, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8, // Apply rounded corners to bars
      }]
    };
    createStyledChart(chartBarCanvasRef, 'bar', barChartData); // Use the styled chart creator

    return () => {
      if (chartBarCanvasRef.current && chartBarCanvasRef.current.chart) {
        chartBarCanvasRef.current.chart.destroy();
      }
    };
  }, []); // Empty dependency array means this runs once on mount


  return (
    // Equivalent of app-container, body styling (background color)
    <div className="min-h-screen font-sans text-white antialiased
      bg-[radial-gradient(circle_farthest-corner_at_-24.7%_-47.3%,_rgba(6,130,165,1)_0%,_rgba(34,48,86,1)_66.8%,_rgba(15,23,42,1)_100.2%)]">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between
                         p-4 md:px-8 rounded-b-xl
                         bg-white/20 backdrop-blur-md"> {/* Blurred white background, no border, no shadow */}
        {/* Logo acting as HOME PAGE link */}
        <h1
          className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-2 md:mb-0 cursor-pointer hover:text-indigo-800 transition duration-300 ease-in-out"
          onClick={() => navigate('/')} // Navigates to the home page route
        >
          HEALTHUB
        </h1>
        <nav className="flex flex-wrap gap-4 font-bold text-lg">
          {/* LOGIN button navigating to /login */}
          <button
            onClick={() => navigate('/login')}
            className="text-white hover:text-indigo-600 transition duration-300 ease-in-out px-3 py-1 rounded-md hover:bg-gray-100/30 hover:backdrop-blur-sm"
          >
            LOGIN
          </button>
          {/* SIGNUP button navigating to /signup */}
          <button
            onClick={() => navigate('/signup')}
            className="text-white hover:text-indigo-600 transition duration-300 ease-in-out px-3 py-1 rounded-md hover:bg-gray-100/30 hover:backdrop-blur-sm"
          >
            SIGNUP
          </button>
        </nav>
      </header>

      <main className="p-6">
        {/* Section 1: Charts and Video */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card for Line Chart */}
          <div className="p-6 font-bold text-center rounded-xl bg-white/20 backdrop-blur-md flex flex-col justify-between"> {/* Blurred white background, no border, no shadow */}
            <h2 className="text-xl font-bold mb-4 text-white">PATIENT RECOVERY PROGRESS (DAYS)</h2> {/* Text is black */}
            <div className="h-64 chart-container flex items-center justify-center"> {/* Fixed height for chart responsiveness */}
              <canvas ref={chartLineCanvasRef} className="w-full h-full"></canvas>
            </div>
          </div>
          {/* Card for Video Embed */}
          <div className="p-6 font-bold text-center rounded-xl bg-white/20 backdrop-blur-md flex flex-col justify-between"> {/* Blurred white background, no border, no shadow */}
            <h2 className="text-xl font-bold mb-4 text-white">How to start?</h2> {/* Text is black */}
            <div className="w-full max-w-2xl mx-auto">
              <div
                className="pointer-events-none rounded-lg overflow-hidden"
                style={{
                  width: '100%',
                  height: '315px',
                  position: 'relative',
                }}
              >
                <iframe
                  title="Cloudinary Player"
                  src="https://player.cloudinary.com/embed/?cloud_name=dgnt90w7o&public_id=v2zksiacr5ziqdvet3du&player[autoplay]=true&player[muted]=true&player[controls]=false&player[loop]=true"
                  allow="autoplay; fullscreen"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Text Banner */}
        <section className="font-bold text-xl p-4 text-center mb-8 rounded-xl bg-white/20 backdrop-blur-md text-white"> {/* Blurred white background, no border, no shadow, text is black */}
          THINGS THIS WEBSITE CAN DO
        </section>

        {/* Section 2: Bar Chart and Doctor Image */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card for Bar Chart */}
          <div className="p-6 font-bold text-center rounded-xl bg-white/20 backdrop-blur-md flex flex-col justify-between"> {/* Blurred white background, no border, no shadow */}
            <div className="h-64 chart-container flex items-center justify-center"> {/* Fixed height for chart responsiveness */}
              <canvas ref={chartBarCanvasRef} className="w-full h-full"></canvas>
            </div>
            <p className="mt-4 text-white">SUPPORTING CHART</p> {/* Text is black */}
          </div>
          {/* Card for Doctor Image */}
          <div className="p-6 font-bold text-center rounded-xl bg-white/20 backdrop-blur-md flex flex-col justify-between"> {/* Blurred white background, no border, no shadow */}
            <img src="images/doctor.jpg" alt="Support" className="w-full rounded-lg mb-2 object-cover h-48 sm:h-auto" // No shadow
                 onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/a0aec0/ffffff?text=Doctor+Image" }} />
            <p className="text-white">Directly connect to doctor from home</p> {/* Text is black */}
          </div>
        </section>

        {/* Section 3: Hospital Image and Text Block */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card for Hospital Image */}
          <div className="p-6 font-bold text-center rounded-xl bg-white/20 backdrop-blur-md flex flex-col justify-between"> {/* Blurred white background, no border, no shadow */}
            <img src="images/patient.jpg" alt="Hospital" className="w-full rounded-lg mb-2 object-cover h-48 sm:h-auto" // No shadow
                 onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/a0aec0/ffffff?text=Hospital+Image" }} />
            <p className="text-white">If serious, then will be consulted to visit to doctor</p> {/* Text is black */}
          </div>
          {/* Card for Text Block */}
          <div className="p-6 font-bold text-center rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center"> {/* Blurred white background, no border, no shadow */}
            <p className="text-xl text-white">At Healthub, we’re transforming how people access and manage healthcare by connecting patients and doctors on a single smart platform. Patients can easily book appointments, chat securely with doctors, and receive personalized daily health tasks powered by AI to improve their well-being. Doctors can manage their schedules, respond to patients in real time, and get a clear calendar view of upcoming appointments. With a focus on simplicity, transparency, and proactive care, Healthub ensures timely communication, consistent follow-ups, and smarter health tracking. Our goal is to make quality healthcare more accessible, organized, and personalized for everyone.</p> {/* Text is black */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 border-t-2 font-bold rounded-t-xl mt-8 bg-white/20 backdrop-blur-md text-white"> {/* Blurred white background, no border, no shadow, text is black */}
        FOOTER © 2025 | HEALTHCARE FOR ALL
      </footer>
    </div>
  );
};

export default HomePage; // Export HomePage
