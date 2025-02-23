var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var CoffeeShopRouter = require('./routes/CoffeeShopPage')
var FlowerShopRouter = require('./routes/FlowerShopPage')
var LoginorRegRouter = require('./routes/RegisterorLoginPage')
var profileRouter = require('./routes/Profile')
var userRouter = require('./routes/user')
var orderRouter = require('./routes/order')
var basketRouter = require('./routes/basket')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'Fl0w3rsAr3Aw3s0m3',
  cookie: { secure: false },
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/coffeeshop', CoffeeShopRouter);
app.use('/FlowerShop', FlowerShopRouter);
app.use('/LoginorRegister', LoginorRegRouter);
app.use('/profile', profileRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter)
app.use('/basket', basketRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
