const express = require('express');
const router = express.Router();
const { login, signup } = require('../controller/userController');
const { auth, isDoctor, isPatient } = require('../middlewares/authMiddleware');
const { createTask, getTasksLast7Days, updateTaskCompletion } = require('../controller/taskController');

// User routes
router.post('/login', login);
router.post('/signup', signup);

// Test routes
router.get('/test', auth, (req, res) => {
  res.status(200).json({ success: true, message: 'Protected route accessed successfully' });
});

// Role-based routes
router.get('/doctor', auth, isDoctor, (req, res) => {
  res.status(200).json({ success: true, message: 'Doctor route accessed successfully' });
});
router.get('/patient', auth, isPatient, (req, res) => {
  res.status(200).json({ success: true, message: 'Patient route accessed successfully' });
});

// Task routes (protected and user-specific)
router.post('/post-tasks', createTask);
router.get('/get-7days-tasks', getTasksLast7Days);
router.patch('/tasks/:id', updateTaskCompletion);

module.exports = router;