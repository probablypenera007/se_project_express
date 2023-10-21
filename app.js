const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
