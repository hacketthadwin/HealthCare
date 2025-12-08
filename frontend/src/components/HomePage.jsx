import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Skiper19 from './UIcomponents/BackgroundScrollStroke';
import { useTheme } from '../context/ThemeContext';
import Header1 from './UIcomponents/Header1';
import Feature3 from './mvpblocks/feature-3';
import Faq3 from './mvpblocks/faq-3';
import Footer4Col from './mvpblocks/footer-4col';

const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

 const createStyledChart = (canvasRef, type, data, options) => {
  if (canvasRef.current) {
    if (canvasRef.current.chart) {
      canvasRef.current.chart.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Create Vibrant Gradient for Area Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(194, 248, 79, 0.4)'); // Glowing Lime
    gradient.addColorStop(1, 'rgba(194, 248, 79, 0)');   // Transparent

    // Force Visibility on Data Series
    if (data.datasets[0]) {
      data.datasets[0].fill = type === 'line';
      data.datasets[0].backgroundColor = type === 'line' ? gradient : '#C2F84F';
      data.datasets[0].borderColor = '#C2F84F'; 
      data.datasets[0].borderWidth = 4;
      data.datasets[0].pointRadius = 5;
      data.datasets[0].pointHoverRadius = 8;
      data.datasets[0].pointBackgroundColor = '#FAFDEE'; // Off-white points for pop
    }

    canvasRef.current.chart = new Chart(canvasRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1F3A4B',
            titleColor: '#C2F84F',
            bodyColor: '#FAFDEE',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 14, weight: '800' },
            padding: 12,
            cornerRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(250, 253, 238, 0.2)'
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#FAFDEE', // High visibility Off-White
              font: { size: 11, weight: '800' },
              padding: 10
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(250, 253, 238, 0.1)', // Dim off-white grid lines
              drawBorder: false
            },
            ticks: {
              color: '#FAFDEE', // High visibility Off-White
              font: { size: 11, weight: '800' },
              callback: (v) => v + (type === 'line' ? '%' : '')
            }
          }
        },
        ...options
      }
    });
  }
};

  const chartLineCanvasRef = useRef(null);
  useEffect(() => {
    const lineChartData = {
      labels: ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7'],
      datasets: [{
        label: 'Patient Recovery Progress',
        data: [10,25,40,60,75,90,100],
        borderColor: 'rgba(50,205,50,1)',
        backgroundColor: 'rgba(50,205,50,0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(50,205,50,1)',
      }],
    };
    createStyledChart(chartLineCanvasRef, 'line', lineChartData);

    return () => {
      chartLineCanvasRef.current?.chart?.destroy();
    };
  }, []);

  const chartBarCanvasRef = useRef(null);
  useEffect(() => {
    const barChartData = {
      labels: ['OPD','Emergency','Surgery','ICU'],
      datasets: [{
        label: 'Visits',
        data: [300,450,200,100],
        backgroundColor: [
          'rgba(255,0,255,0.7)',
          'rgba(0,255,255,0.7)',
          'rgba(255,215,0,0.7)',
          'rgba(50,205,50,0.7)',
        ],
        borderColor: [
          'rgba(255,0,255,1)',
          'rgba(0,255,255,1)',
          'rgba(255,215,0,1)',
          'rgba(50,205,50,1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      }]
    };
    createStyledChart(chartBarCanvasRef, 'bar', barChartData);

    return () => {
      chartBarCanvasRef.current?.chart?.destroy();
    };
  }, []);



  return (
    <div className="relative min-h-screen">
      <Skiper19 />
      <Header1/>
      <div className="absolute inset-0 flex flex-col items-center mt-16 justify-start p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-12">
        <h1 className="font-jakarta-sans relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-medium tracking-[-0.08em] text-center leading-tight">
          Where modern <br /> healthcare meets <br />
          modern solutions
        </h1>

        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1F3A4B] dark:text-[#FAFDEE] mb-2 sm:mb-4 text-center">Patient Recovery Progress</h2>
            <div className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
              <canvas ref={chartLineCanvasRef}></canvas>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1F3A4B] dark:text-[#FAFDEE] mb-2 sm:mb-4 text-center">Department Visits</h2>
            <div className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
              <canvas ref={chartBarCanvasRef}></canvas>
            </div>
          </div>
        </div>
              <Feature3/>
      <Faq3/>
      <Footer4Col/>
      </div>


    </div>
  );
};

export default HomePage; // Export HomePage
