const mongoose = require('mongoose');

const tasks = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});  //this timestamps option adds createdAt and updatedAt fields

module.exports = mongoose.model('Tasks', tasks);


