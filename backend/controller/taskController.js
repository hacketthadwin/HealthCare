// controller/taskController.js
const Task = require('../models/tasks');

exports.createTask = async (req, res) => {
  try {
    const { name, completed, date } = req.body;
    const taskDate = date || new Date().toISOString().split('T')[0];

    const existingDates = await Task.distinct("date");

    if (!existingDates.includes(taskDate)) {
      if (existingDates.length >= 7) {
        const oldestTask = await Task.findOne().sort({ date: 1 });
        if (oldestTask) {
          await Task.deleteMany({ date: oldestTask.date });
        }
      }
    }

    const newTask = await Task.create({ name, completed, date: taskDate });

    res.status(200).json({
      success: true,
      message: "Task created successfully",
      data: newTask
    });

  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({
      success: false,
      message: "Task could not be created",
      error: err.message
    });
  }
};

// controller/taskController.js
exports.getTasksLast7Days = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 6 days ago + today = 7 days

    // Format dates consistently as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    const startDate = formatDate(sevenDaysAgo);
    const endDate = formatDate(today);

    console.log(`Fetching tasks between ${startDate} and ${endDate}`);

    const tasks = await Task.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    console.log(`Found ${tasks.length} tasks`);
    
    res.status(200).json({
      success: true,
      message: "Fetched tasks from the last 7 days",
      data: tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: err.message
    });
  }
};

exports.updateTaskCompletion = async (req, res) => {
  try {
    const { completed } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task updated',
      data: updated
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Update failed',
      error: err.message
    });
  }
};