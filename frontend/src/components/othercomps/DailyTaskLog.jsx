import React, {
    useState, useEffect, useRef, useCallback, useContext, useMemo
} from 'react';
import { AIResponseContext } from '../../context/AIResponseContext';
import { TaskProgressContext } from '../../context/TaskProgressContext';
import axios from 'axios';

// Helper function to retrieve the authentication token from local storage.
// This assumes that your login process successfully stores the JWT token
// in localStorage under the key 'token'.
const getAuthToken = () => {
    return localStorage.getItem('userToken'); // Make sure this key matches what your login stores
};

// Helper functions are outside the component to ensure they are stable
// and do not cause unnecessary re-renders of the component itself.
const formatDate = (dateString) => {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', opts);
};

const parseHTMLList = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return Array.from(doc.querySelectorAll('li')).map(li => li.textContent.trim());
};

// This function groups tasks by date and calculates summaries.
// It's a pure function, so it can live outside the component.
const groupTasksByDate = (tasks) => {
    const grouped = {};
    tasks.forEach(task => {
        const date = task.date.split('T')[0]; // Get YYYY-MM-DD part of the date
        if (!grouped[date]) {
            grouped[date] = {
                date,
                tasks: [],
                summary: { totalTasks: 0, completedTasks: 0, completionPercentage: 0 }
            };
        }
        grouped[date].tasks.push({
            id: task._id, // Use task._id for the unique identifier
            description: task.name,
            completed: task.completed
        });
        grouped[date].summary.totalTasks += 1;
        if (task.completed) grouped[date].summary.completedTasks += 1;
    });

    // Calculate completion percentage for each day group
    Object.values(grouped).forEach(group => {
        group.summary.completionPercentage = group.summary.totalTasks
            ? (group.summary.completedTasks / group.summary.totalTasks) * 100
            : 0;
    });

    // Sort groups by date to ensure consistent order
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// TaskItem component is memoized using React.memo.
// This is crucial for performance. It will only re-render if its 'task' or 'onToggle' props change.
const TaskItem = React.memo(({ task, onToggle }) => (
    <li className="flex items-center bg-white/10 p-2 rounded">
        <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, task.completed)} // Pass current completion status
            className="mr-3 h-5 w-5 accent-lime-400 flex-shrink-0"
        />
        <span className={task.completed ? "line-through text-white/70" : "text-white"}>
            {task.description}
        </span>
    </li>
));

function DailyTaskLog({ onTaskUpdate }) {
    // Destructure context values. Assumed setCompletionPercentage is stable.
    const { lastAIMessage } = useContext(AIResponseContext);
    const { setCompletionPercentage } = useContext(TaskProgressContext);

    // State variables for task data, loading, errors, and current day index
    const [taskLogData, setTaskLogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);

    // useRef for the interval ID, allowing cleanup on unmount
    const intervalRef = useRef(null);

    // Memoize today's date string to ensure it's stable and doesn't cause
    // useCallback dependencies to trigger unnecessarily.
    const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);

    // Memoized function to fetch the task log from the backend.
    // Wrapped in useCallback to prevent it from being recreated on every render,
    // which would break the useEffect dependency array.
    const fetchTaskLog = useCallback(async () => {
        try {
            setLoading(true); // Set loading state to true while fetching
            setError(null);    // Clear any previous errors

            const token = getAuthToken(); // Get the authentication token
            if (!token) {
                // If token is missing, set an error and stop loading.
                // You might want to redirect the user to a login page here.
                setError("Authentication required. Please log in.");
                setLoading(false);
                return;
            }

            const res = await axios.get("http://localhost:5000/api/v1/get-7days-tasks", {
                headers: {
                    Authorization: `Bearer ${token}` // IMPORTANT: Send the JWT token
                }
            });

            if (res.data.success) {
                const grouped = groupTasksByDate(res.data.data);
                setTaskLogData(grouped);
                // Set the current index to today's date, or the last available day if today is not found
                const todayIndex = grouped.findIndex(d => d.date === todayDateString);
                setCurrentIndex(todayIndex !== -1 ? todayIndex : grouped.length - 1);
            } else {
                throw new Error(res.data.message || 'Failed to fetch tasks');
            }
        } catch (e) {
            // More robust error handling: check for specific HTTP status codes
            if (e.response && e.response.status === 401) {
                setError("Session expired or unauthorized. Please log in again.");
                // Optionally: Redirect to login page
                // window.location.href = '/login'; 
            } else {
                setError(e.message || 'Error loading tasks');
            }
            console.error("Error fetching task log:", e); // Log the error for debugging
        } finally {
            setLoading(false); // Set loading state to false after fetch completes
        }
    }, [todayDateString]); // Dependency: todayDateString (memoized)

    // Memoized function to post a new task to the backend.
    // Wrapped in useCallback for stability.
    const postNewTask = useCallback(async (description) => {
        try {
            const token = getAuthToken(); // Get the authentication token
            if (!token) {
                throw new Error("Authentication required. Please log in.");
            }

            const res = await axios.post("http://localhost:5000/api/v1/post-tasks", {
                name: description,
                date: todayDateString,
                completed: false
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // IMPORTANT: Send the JWT token
                }
            });
            if (!res.data.success) throw new Error('Failed to create task');
            return res.data.data;
        } catch (e) {
            console.error('Error posting new task:', e);
            // Optionally handle 401 errors here as well if the API supports it
            throw e; // Re-throw the error to be handled by the calling useEffect
        }
    }, [todayDateString]); // Dependency: todayDateString (memoized)

    // Memoized function to update task completion status on the backend.
    // Wrapped in useCallback for stability.
    const updateTaskCompletion = useCallback(async (taskId, completed) => {
        try {
            const token = getAuthToken(); // Get the authentication token
            if (!token) {
                throw new Error("Authentication required. Please log in.");
            }

            const res = await axios.patch(`http://localhost:5000/api/v1/tasks/${taskId}`, { completed }, {
                headers: {
                    Authorization: `Bearer ${token}` // IMPORTANT: Send the JWT token
                }
            });
            if (!res.data.success) throw new Error('Failed to update task on backend');
            return res.data.data;
        } catch (e) {
            console.error(`Error updating task ${taskId} completion:`, e);
            // Optionally handle 401 errors here as well if the API supports it
            throw e; // Re-throw the error to be handled by handleTaskCheck for UI reversion
        }
    }, []); // No dependencies, as it only uses props passed into it

    // useEffect for initial data fetch and setting up polling.
    // It runs once on component mount and cleans up the interval on unmount.
    useEffect(() => {
        fetchTaskLog(); // Initial fetch
        // Set up polling every 5 minutes (300,000 milliseconds) to keep data fresh.
        intervalRef.current = setInterval(fetchTaskLog, 5 * 60 * 1000);
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalRef.current);
    }, [fetchTaskLog]); // Dependency: fetchTaskLog (memoized function)

    // useEffect for handling new AI messages (e.g., adding tasks generated by AI).
    // It runs when 'lastAIMessage' or its dependencies change.
    useEffect(() => {
        if (!lastAIMessage) return; // Do nothing if there's no AI message
        const aiItems = parseHTMLList(lastAIMessage);
        if (!aiItems.length) return; // Do nothing if AI message contains no list items

        const postTasksAndRefresh = async () => {
            try {
                // Post all new tasks from the AI message concurrently
                await Promise.all(aiItems.map(desc => postNewTask(desc)));
                // After posting, re-fetch the entire task log to include the new tasks
                fetchTaskLog();
            } catch (e) {
                console.error('Failed to post AI tasks and refresh log:', e);
            }
        };
        postTasksAndRefresh();
    }, [lastAIMessage, postNewTask, fetchTaskLog]); // Dependencies: lastAIMessage, memoized postNewTask and fetchTaskLog

    // useEffect to update the completion percentage in the global context.
    // It runs whenever 'taskLogData' changes, ensuring the progress bar is always up-to-date.
    useEffect(() => {
        const today = taskLogData.find(d => d.date === todayDateString);
        if (today) {
            setCompletionPercentage(today.summary.completionPercentage);
        } else {
            // If there are no tasks for today, reset the completion percentage to 0
            setCompletionPercentage(0);
        }
    }, [taskLogData, todayDateString, setCompletionPercentage]); // Dependencies: taskLogData, memoized todayDateString, setCompletionPercentage from context

    // Main handler for checking/unchecking a task.
    // Wrapped in useCallback for stability; this is the `onToggle` prop for TaskItem.
    const handleTaskCheck = useCallback(async (taskId, wasCompleted) => {
        // Optimistic UI update: Update local state immediately for a snappier user experience.
        setTaskLogData(prev =>
            prev.map((day, idx) => {
                // Only modify the current day's data
                if (idx !== currentIndex) return day;

                const updatedTasks = day.tasks.map(t =>
                    t.id === taskId ? { ...t, completed: !wasCompleted } : t // Toggle completion status
                );
                const done = updatedTasks.filter(t => t.completed).length;
                const pct = updatedTasks.length ? (done / updatedTasks.length) * 100 : 0;

                return {
                    ...day,
                    tasks: updatedTasks,
                    summary: {
                        totalTasks: updatedTasks.length,
                        completedTasks: done,
                        completionPercentage: pct
                    }
                };
            })
        );

        try {
            // Send the update to the backend API
            await updateTaskCompletion(taskId, !wasCompleted);
            // If a parent component provided an onTaskUpdate callback, call it.
            // IMPORTANT: Ensure the onTaskUpdate prop itself is wrapped in useCallback in the parent
            // to prevent unnecessary re-renders of this component.
            if (onTaskUpdate) {
                onTaskUpdate();
            }
        } catch (e) {
            console.error('Task update failed on backend, reverting UI:', e);
            // If the backend call fails, revert the UI to its previous state
            setTaskLogData(prev =>
                prev.map((day, idx) => {
                    if (idx !== currentIndex) return day;
                    const revertedTasks = day.tasks.map(t =>
                        t.id === taskId ? { ...t, completed: wasCompleted } : t // Revert to original completion status
                    );
                    const done = revertedTasks.filter(t => t.completed).length;
                    const pct = revertedTasks.length ? (done / revertedTasks.length) * 100 : 0;
                    return {
                        ...day,
                        tasks: revertedTasks,
                        summary: {
                            totalTasks: revertedTasks.length,
                            completedTasks: done,
                            completionPercentage: pct
                        }
                    };
                })
            );
            // Additionally, if the error is due to authentication, consider showing a more prominent message
            // or redirecting the user to login.
            if (e.response && e.response.status === 401) {
                setError("Your session has expired. Please log in again.");
            } else {
                setError("Failed to update task. Please try again.");
            }
        }
    }, [currentIndex, onTaskUpdate, updateTaskCompletion]); // Dependencies: currentIndex, onTaskUpdate (from parent), memoized updateTaskCompletion

    // Memoize `currentDay` object to prevent unnecessary re-calculations
    // and re-renders if taskLogData or currentIndex haven't effectively changed.
    const currentDay = useMemo(() => (
        currentIndex !== null && taskLogData[currentIndex] ? taskLogData[currentIndex] : null
    ), [taskLogData, currentIndex]);

    // Memoized handlers for previous and next day buttons.
    const handlePrevDay = useCallback(() => {
        setCurrentIndex(i => Math.max(0, i - 1));
    }, []); // No dependencies as it only uses setter function

    const handleNextDay = useCallback(() => {
        setCurrentIndex(i => Math.min(taskLogData.length - 1, i + 1));
    }, [taskLogData.length]); // Dependency: taskLogData.length for correct boundary checking

    return (
        <div className="w-full max-w-2xl mx-auto my-4 p-4 sm:p-6 rounded-xl bg-white/20 backdrop-blur-md text-white">
            {/* Display error message if any */}
            {error && (
                <div className="text-center text-red-400 mb-4">Error: {error}</div>
            )}

            {/* Conditional rendering for loading state or no data */}
            {loading || !currentDay ? (
                <div className="text-center text-white">
                    {loading ? 'Loading tasks…' : 'No tasks available for this date.'}
                </div>
            ) : (
                <>
                    {/* Navigation for previous/next day */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handlePrevDay}
                            disabled={currentIndex === 0}
                            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
                        >
                            ⬅ Previous
                        </button>
                        <h2 className="text-lg font-bold text-center flex-grow">
                            Tasks for {formatDate(currentDay.date)}
                        </h2>
                        <button
                            onClick={handleNextDay}
                            disabled={currentIndex === taskLogData.length - 1}
                            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
                        >
                            Next ➡
                        </button>
                    </div>

                    {/* Task list container */}
                    <div className="max-h-[20rem] overflow-y-auto">
                        {currentDay.tasks.length > 0 ? (
                            <ul className="space-y-2">
                                {/* Render TaskItem components */}
                                {currentDay.tasks.map(t => (
                                    <TaskItem key={t.id} task={t} onToggle={handleTaskCheck} />
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-white/70 text-sm py-6">
                                No tasks assigned for this date.
                            </div>
                        )}
                    </div>

                    {/* Task summary */}
                    <div className="mt-4 text-center text-sm text-white/80 font-bold">
                        Completed: {currentDay.summary.completedTasks} / {currentDay.summary.totalTasks} (
                        {currentDay.summary.completionPercentage.toFixed(0)}%)
                    </div>
                </>
            )}
        </div>
    );
}

export default DailyTaskLog;
