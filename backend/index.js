require('dotenv').config();
const express = require('express');
const app = express();
console.log("Loaded DB URL:", process.env.DATABASE_URL);
const Message = require('./models/message');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const corsOptions = {
 origin: 'http://localhost:3000', // your frontend
 methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Ensure all necessary methods are allowed
 credentials: true,
 allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
require("./config/database").connect();

// Socket.IO server setup
const io = new Server(server, {
 cors: {
 origin: 'http://localhost:3000',
 methods: ['GET', 'POST'],
 credentials: true
 }
});

io.on('connection', (socket) => {
 console.log('User connected:', socket.id);
 socket.on('joinRoom', async ({ roomId, userId, role }) => {
 socket.join(roomId);
 console.log(`${role} ${userId} joined room: ${roomId}`);

try {
 const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
 socket.emit('previousMessages', messages);
 } catch (err) {
 console.error('Error fetching previous messages:', err);
 }
 });

 socket.on('sendMessage', async ({ roomId, senderId, senderName, receiverId, message }) => {
 io.to(roomId).emit('receiveMessage', {
 senderId,
 senderName,
 message,
 timestamp: Date.now(),
 roomId
 });

try {
 await Message.create({
 roomId,
 sender: senderId,
 receiver: receiverId,
 message
 });
 } catch (err) {
 console.error('Error saving message:', err);
 }
 });


 socket.on('disconnect', () => {
 console.log('User disconnected:', socket.id);
 });
});

// Routes
const user = require("./routes/user");
app.use("/api/v1", user);
app.use("/api/v1/appointments", require("./routes/appointmentRoutes"));

app.get('/', (req, res) => {
 res.send('Hello, World!');
});

server.listen(5000, () => {
 console.log('Server is running on port 5000');
});