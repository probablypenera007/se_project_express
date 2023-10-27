/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
const app = express();

// code reviewer note: will implement this after passing project,
// had compatibility issue with mongoDB using mac OS sonoma had to troubleshoot.
// We recommend using the helmet middleware to set security headers
// for your API http://expressjs.com/en/advanced/best-practice-security.html

// mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db',() => {
mongoose.connect('mongodb://localhost:27017/wtwr_db',() => {
console.log('CONNECTED TO DB!')}, e => console.log("DB NOT CONNECTED",e));



const routes = require('./routes');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '653ab3c31c0c1371ce3ed33d'// paste the _id of the test user created in the previous step
  };
  next();
});
app.use(routes);



app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
