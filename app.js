const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
