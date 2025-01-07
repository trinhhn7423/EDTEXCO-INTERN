var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { RedisStore } = require("connect-redis");
const session = require('express-session');
const { createClient } = require('redis');
// let redisClient = createClient()
// redisClient.connect().catch(console.error)

// let redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "myapp:",
// })
var app = express();


// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  // store: redisStore,
  secret: process.env.SESSION_KEY,
  resave: false, // giả sử set thời gian hết hạn của cookie là 10p thì sẽ set thêm 10p nữa sau mỗi yêu cầu 
  saveUninitialized: true, /// save 
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 1000,

  }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("CONNECT MONGODB SUCCESSFULLY");
  })
  .catch((err) => {
    console.log("error connecting to server");
    console.log(err);
  })

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
