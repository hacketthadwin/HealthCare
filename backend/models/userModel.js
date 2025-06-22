const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Doctor', 'Patient'],
    },
}, { timestamps: true });  //this timestamps option adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema for a User model with fields for name, email, password, and role.

