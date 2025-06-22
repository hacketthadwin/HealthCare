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

      // Group by date
      const grouped = {};
      rawTasks.forEach(task => {
        const date = task.date.split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(task);
      });

      // Get last 7 days
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
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.3,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)',
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
      legend: { position: 'top' },
      title: { display: true, text: 'Your Daily Task Completion Rate', font: { size: 18 } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) label += context.parsed.y + '%';
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        title: { display: true, text: 'Completion Percentage (%)' },
        ticks: { callback: value => value + '%' }
      },
      x: { title: { display: true, text: 'Date' } }
    },
  };

  if (loading) {
    return <div className="text-center p-5">Loading task progress...</div>;
  }
  if (error) {
    return <div className="text-center p-5 text-red-500">Error: {error}</div>;
  }
  if (chartData.labels.length === 0) {
    return <div className="text-center p-5">No task data available yet. Start completing tasks!</div>;
  }

  return (
    <div className="w-[18rem] sm:w-[35rem] h-[30rem] ml-0 sm:ml-5 my-5 p-4 bg-white rounded-lg shadow-md">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default DailyTaskCompletionChart;
