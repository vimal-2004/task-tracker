const mongoose = require('mongoose');
// Replace with your actual MongoDB URI
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://vimalravi34:Vimal2004@cluster0.6qrxzrv.mongodb.net/team';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const teamsRouter = require('./routes/teams');
const tasksRouter = require('./routes/tasks');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/tasks', tasksRouter);

module.exports = app;
