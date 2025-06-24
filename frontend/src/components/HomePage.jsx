import React, { useEffect, useRef ,useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate only, no BrowserRouter here
import ReactPlayer from 'react-player/youtube';

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



  // ChartLine component logic
  const chartLineCanvasRef = useRef(null);
  useEffect(() => {
    // Ensure Chart is available globally from the script tag
    if (window.Chart) {
      const chart = new window.Chart(chartLineCanvasRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Patients Treated',
            data: [100, 200, 150, 300],
            backgroundColor: 'rgba(34, 197, 94, 0.4)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#4A5568' // Tailwind gray-700 for legend text
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#4A5568'
              }
            },
            y: {
              ticks: {
                color: '#4A5568'
              }
            }
          }
        }
      });
      return () => chart.destroy();
    }
  }, []);

  // ChartBar component logic
  const chartBarCanvasRef = useRef(null);
  useEffect(() => {
    // Ensure Chart is available globally from the script tag
    if (window.Chart) {
      const chart = new window.Chart(chartBarCanvasRef.current, {
        type: 'bar',
        data: {
          labels: ['OPD', 'Emergency', 'Surgery', 'ICU'],
          datasets: [{
            label: 'Visits',
            data: [300, 450, 200, 100],
            backgroundColor: ['#60A5FA', '#FBBF24', '#F87171', '#34D399'], // Tailwind equivalents: blue-400, amber-400, red-400, emerald-400
            borderRadius: 8, // Apply rounded corners to bars
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#4A5568'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#4A5568'
              }
            },
            y: {
              ticks: {
                color: '#4A5568'
              }
            }
          }
        }
      });
      return () => chart.destroy();
    }
  }, []);

  // VideoEmbed logic (integrated directly)
  const VideoEmbed = ({ src, title }) => {
    return (
      <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-lg"> {/* Aspect ratio box (16:9) and shadow */}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  return (
    // Equivalent of app-container, body styling (background color)
    <div className="min-h-screen bg-green-200 font-sans text-gray-800 antialiased">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b-2 border-gray-900 p-4 md:px-8 bg-white shadow-md rounded-b-xl">
        {/* Logo acting as HOME PAGE link */}
        <h1
          className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-2 md:mb-0 cursor-pointer hover:text-indigo-800 transition duration-300 ease-in-out"
          onClick={() => navigate('/')} // Navigates to the home page route
        >
          HEALTHCARE FOR ALL
        </h1>
        <nav className="flex flex-wrap gap-4 font-bold text-lg">
          {/* LOGIN button navigating to /login */}
          <button
            onClick={() => navigate('/login')}
            className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out px-3 py-1 rounded-md hover:bg-gray-100"
          >
            LOGIN
          </button>
          {/* SIGNUP button navigating to /signup */}
          <button
            onClick={() => navigate('/signup')}
            className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out px-3 py-1 rounded-md hover:bg-gray-100"
          >
            SIGNUP
          </button>
        </nav>
      </header>

      <main className="p-6">
        {/* Section 1: Charts and Video */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card for Line Chart */}
          <div className="bg-white border-2 border-gray-900 p-6 font-bold text-center shadow-lg rounded-xl flex flex-col justify-between">
            <h2 className="text-xl font-bold mb-4 text-gray-700">SOME CHARTS TO SHOW THE WEBSITE WORK</h2>
            <div className="h-64 chart-container flex items-center justify-center"> {/* Fixed height for chart responsiveness */}
              <canvas ref={chartLineCanvasRef} className="w-full h-full"></canvas>
            </div>
          </div>
          {/* Card for Video Embed */}
          <div className="bg-white border-2 border-gray-900 p-6 font-bold text-center shadow-lg rounded-xl flex flex-col justify-between">
            <h2 className="text-xl font-bold mb-4 text-gray-700">GPT DEMO VIDEO</h2>
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="pointer-events-none"
        style={{
          width: '100%',
          height: '315px',
          position: 'relative',
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=3vWV4HAr1KA"
          playing={true}          // Autoplay
          muted={true}            // Start muted (required to autoplay)
          controls={false}        // No YouTube controls
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 0,
                disablekb: 1,
                iv_load_policy: 3,
              },
            },
          }}
          width="100%"
          height="100%"
        />
      </div>
    </div>


          </div>
        </section>

        {/* Text Banner */}
        <section className="bg-white border-2 border-gray-900 font-bold text-xl p-4 text-center mb-8 shadow-lg rounded-xl">
          THINGS THIS WEBSITE CAN DO
        </section>

        {/* Section 2: Bar Chart and Doctor Image */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card for Bar Chart */}
          <div className="bg-white border-2 border-gray-900 p-6 font-bold text-center shadow-lg rounded-xl flex flex-col justify-between">
            <div className="h-64 chart-container flex items-center justify-center"> {/* Fixed height for chart responsiveness */}
              <canvas ref={chartBarCanvasRef} className="w-full h-full"></canvas>
            </div>
            <p className="mt-4 text-gray-700">SUPPORTING CHART</p>
          </div>
          {/* Card for Doctor Image */}
          <div className="bg-white border-2 border-gray-900 p-6 font-bold text-center shadow-lg rounded-xl flex flex-col justify-between">
            <img src="https://source.unsplash.com/600x300/?doctor" alt="Support" className="w-full rounded-lg mb-2 object-cover h-48 sm:h-auto" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/a0aec0/ffffff?text=Doctor+Image" }} />
            <p className="text-gray-700">IMAGE SUPPORTING WEBSITE</p>
          </div>
        </section>

        {/* Section 3: Hospital Image and Text Block */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card for Hospital Image */}
          <div className="bg-white border-2 border-gray-900 p-6 font-bold text-center shadow-lg rounded-xl flex flex-col justify-between">
            <img src="https://source.unsplash.com/600x300/?hospital" alt="Hospital" className="w-full rounded-lg mb-2 object-cover h-48 sm:h-auto" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/a0aec0/ffffff?text=Hospital+Image" }} />
            <p className="text-gray-700">IMAGE BLOCK</p>
          </div>
          {/* Card for Text Block */}
          <div className="bg-white border-2 border-gray-900 p-6 font-bold text-center shadow-lg rounded-xl flex items-center justify-center">
            <p className="text-xl text-gray-700">TEXT BLOCK: Hospital Infrastructure</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-white border-t-2 border-gray-900 font-bold text-gray-700 shadow-inner rounded-t-xl mt-8">
        FOOTER © 2025 | HEALTHCARE FOR ALL
      </footer>
    </div>
  );
};

export default HomePage; // Export HomePage
