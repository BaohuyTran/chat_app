const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the chat application that is not named yet...');
})

app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port}`);
});

mongoose.connect(uri)
  .then(() => console.log('MongoDB connecttion established'))
  .catch((error) => console.log('MongoDB connecttion failed:', error.message));

// // try this if future error
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connecttion established'))
//   .catch((error) => console.log('MongoDB connecttion failed:', error.message));