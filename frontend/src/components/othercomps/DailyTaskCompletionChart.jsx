import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

function DailyTaskCompletionChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/v1/get-7days-tasks");
      if (!res.data.success) throw new Error(res.data.message);

      const rawTasks = res.data.data;

      const grouped = {};
      rawTasks.forEach(task => {
        const date = task.date.split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(task);
      });

      const today = new Date();
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const tasks = grouped[dateStr] || [];
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pct = total ? (completed / total) * 100 : 0;
        last7.push({ date: dateStr, percentage: parseFloat(pct.toFixed(2)) });
      }

      const labels = last7.map(item => formatDate(item.date));
      const percentages = last7.map(item => item.percentage);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Daily Task Completion (%)',
            data: percentages,
            borderColor: 'rgba(0, 255, 255, 1)', // Neon Cyan
            backgroundColor: 'rgba(0, 255, 255, 0.2)', // Slightly transparent neon cyan fill
            tension: 0.3,
            pointBackgroundColor: 'rgba(0, 255, 255, 1)',
            pointBorderColor: 'rgba(255, 255, 255, 0.8)',
            pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointHoverBorderColor: 'rgba(0, 255, 255, 1)',
          },
        ],
      });
    } catch (e) {
      console.error('Error fetching task data:', e);
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
    intervalRef.current = setInterval(fetchTaskData, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: window.innerWidth < 640 ? 12 : 14, // Responsive font size
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Your Daily Task Completion Rate',
        font: {
          size: window.innerWidth < 640 ? 14 : 18, // Responsive font size
          weight: 'bold',
        },
        color: 'white',
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: 'rgba(255,255,255,1)',
        bodyColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(0,255,255,0.8)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) label += context.parsed.y + '%';
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Completion Percentage (%)',
          color: 'rgba(255, 0, 255, 0.8)',
          font: {
            size: window.innerWidth < 640 ? 12 : 14, // Responsive font size
            weight: 'bold',
          },
        },
        ticks: {
          callback: value => value + '%',
          color: 'rgba(255, 0, 255, 0.8)',
          font: {
            size: window.innerWidth < 640 ? 10 : 12, // Responsive font size
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(255, 0, 255, 0.2)',
          borderColor: 'rgba(255, 0, 255, 0.5)',
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: false,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'rgba(0, 255, 255, 0.8)',
          font: {
            size: window.innerWidth < 640 ? 12 : 14, // Responsive font size
            weight: 'bold',
          },
        },
        ticks: {
          color: 'rgba(0, 255, 255, 0.8)',
          font: {
            size: window.innerWidth < 640 ? 10 : 12, // Responsive font size
            weight: 'bold',
          },
          maxRotation: window.innerWidth < 640 ? 45 : 0, // Rotate labels on mobile
          minRotation: window.innerWidth < 640 ? 45 : 0,
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)',
          borderColor: 'rgba(0, 255, 255, 0.5)',
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 text-center text-white bg-white/20 backdrop-blur-md rounded-lg">
        Loading task progress...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 text-center text-rose-500 bg-white/20 backdrop-blur-md rounded-lg">
        Error: {error}
      </div>
    );
  }
  if (chartData.labels.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 text-center text-white bg-white/20 backdrop-blur-md rounded-lg">
        No task data available yet. Start completing tasks!
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] ml-0 my-4 sm:my-6 p-3 sm:p-4 h-[22rem] sm:h-[26rem] md:h-[30rem] 
                    bg-white/20 backdrop-blur-md rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default DailyTaskCompletionChart;