require('dotenv').config();
const express = require('express');
const app = express();
console.log("Loaded DB URL:", process.env.DATABASE_URL);
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(express.json());

require("./config/database").connect()

const user = require("./routes/user");
app.use("/api/v1",user);

app.get('/', (req, res) => {
  res.send('Hello, World!');
}
);
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});