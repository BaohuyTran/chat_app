const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

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