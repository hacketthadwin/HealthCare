require('dotenv').config();
const express = require('express');
const app = express();
console.log("Loaded DB URL:", process.env.DATABASE_URL);
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Or your React app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // <-- CRITICAL
};

app.use(cors(corsOptions));



app.use(express.json());

require("./config/database").connect()

const user = require("./routes/user");
app.use("/api/v1",user);
app.use("/api/v1/appointments", require("./routes/appointmentRoutes"));

app.get('/', (req, res) => {
  res.send('Hello, World!');
}
);
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});