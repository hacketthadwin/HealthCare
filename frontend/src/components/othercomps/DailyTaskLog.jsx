import React, { useState, useEffect, useRef, useContext } from 'react';
import { AIResponseContext } from '../../context/AIResponseContext';
import { TaskProgressContext } from '../../context/TaskProgressContext';
import axios from 'axios';

const formatDate = (dateString) => {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', opts);
};

const parseHTMLList = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return Array.from(doc.querySelectorAll('li')).map(li => li.textContent.trim());
};

const groupTasksByDate = (tasks) => {
  const grouped = {};
  tasks.forEach(task => {
    const date = task.date.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = {
        date,
        tasks: [],
        summary: { totalTasks: 0, completedTasks: 0, completionPercentage: 0 }
      };
    }
    grouped[date].tasks.push({
      id: task._id,
      description: task.name,
      completed: task.completed
    });
    grouped[date].summary.totalTasks += 1;
    if (task.completed) grouped[date].summary.completedTasks += 1;
  });
  Object.values(grouped).forEach(group => {
    group.summary.completionPercentage = group.summary.totalTasks
      ? (group.summary.completedTasks / group.summary.totalTasks) * 100
      : 0;
  });
  return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
};

function DailyTaskLog({ onTaskUpdate }) {
  const { lastAIMessage } = useContext(AIResponseContext);
  const { setCompletionPercentage } = useContext(TaskProgressContext);

  const [taskLogData, setTaskLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const intervalRef = useRef(null);

  const todayDateString = new Date().toISOString().split('T')[0];

  const fetchTaskLog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/v1/get-7days-tasks");
      if (response.data.success) {
        const groupedData = groupTasksByDate(response.data.data);
        setTaskLogData(groupedData);

        // Set currentIndex to today’s date
        const todayIndex = groupedData.findIndex(d => d.date === todayDateString);
        setCurrentIndex(todayIndex !== -1 ? todayIndex : groupedData.length - 1);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
    } catch (e) {
      setError(e.message || 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const postNewTask = async (description) => {
    const response = await axios.post("http://localhost:5000/api/v1/post-tasks", {
      name: description,
      date: todayDateString,
      completed: false
    });
    if (!response.data.success) throw new Error('Failed to create task');
    return response.data.data;
  };

  const updateTaskCompletion = async (taskId, completed) => {
    const response = await axios.patch(`http://localhost:5000/api/v1/tasks/${taskId}`, { completed });
    if (!response.data.success) throw new Error('Failed to update task');
    return response.data.data;
  };

  useEffect(() => {
    fetchTaskLog();
    intervalRef.current = setInterval(fetchTaskLog, 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!lastAIMessage) return;
    const aiItems = parseHTMLList(lastAIMessage);
    if (!aiItems.length) return;
    const postTasks = async () => {
      await Promise.all(aiItems.map(desc => postNewTask(desc)));
      fetchTaskLog();
    };
    postTasks();
  }, [lastAIMessage, todayDateString]);

  useEffect(() => {
    const today = taskLogData.find(d => d.date === todayDateString);
    if (today) {
      setCompletionPercentage(today.summary.completionPercentage);
    }
  }, [taskLogData, todayDateString, setCompletionPercentage]);

  const handleTaskCheck = async (taskId, date, wasCompleted) => {
    setTaskLogData(prev =>
      prev.map(day => {
        if (day.date !== date) return day;
        const tasks = day.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !wasCompleted } : t
        );
        const doneCount = tasks.filter(t => t.completed).length;
        const pct = tasks.length ? (doneCount / tasks.length) * 100 : 0;
        return {
          ...day,
          tasks,
          summary: { totalTasks: tasks.length, completedTasks: doneCount, completionPercentage: pct }
        };
      })
    );
    try {
      await updateTaskCompletion(taskId, !wasCompleted);
    } catch (e) {
      alert('Failed to update task. Please try again.');
      fetchTaskLog();
    }
  };

  if (loading || currentIndex === null) return <div className="p-5 text-center text-gray-700">Loading tasks…</div>;
  if (error) return <div className="p-5 text-center text-red-600">Error: {error}</div>;
  if (!taskLogData.length) return <div className="text-center p-5">No tasks available</div>;

  const currentDay = taskLogData[currentIndex];

  return (
    <div className="w-full max-w-[700px] px-4 sm:px-6 mx-auto my-8 p-6 bg-white rounded-lg shadow overflow-y-auto h-[30rem]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <h2 className="text-xl font-bold text-center flex-grow">
          Tasks for {formatDate(currentDay.date)}
        </h2>
        <button
          onClick={() => setCurrentIndex(i => Math.min(taskLogData.length - 1, i + 1))}
          disabled={currentIndex === taskLogData.length - 1}
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

      {currentDay.tasks.length > 0 ? (
        <ul className="space-y-2">
          {currentDay.tasks.map(t => (
            <li
              key={t.id}
              className="flex items-start min-h-[3rem] p-2 border border-gray-200 rounded-md"
            >
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleTaskCheck(t.id, currentDay.date, t.completed)}
                className="mt-1 mr-3 h-5 w-5 text-blue-600 flex-shrink-0"
              />
              <span
                className={`text-base leading-tight ${t.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
              >
                {t.description}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No tasks assigned.</div>
      )}

      {currentDay.tasks.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Completed: {currentDay.summary.completedTasks} / {currentDay.summary.totalTasks} (
          {currentDay.summary.completionPercentage.toFixed(0)}%)
        </div>
      )}
    </div>
  );
}

export default DailyTaskLog;
