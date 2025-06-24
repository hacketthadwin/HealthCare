const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Doctor'], // Updated to match your declaration
      message: 'Role must be Doctor',
    },
    default: 'Doctor', // Updated default value
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;