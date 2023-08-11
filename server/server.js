// EXPRESSS
const express = require('express');
const app = express();
const server = require('http').Server(app)
const morgan = require('morgan');
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
// const enforce = require("express-sslify")
require('dotenv').config();

/** Passport Configuration */
const passport = require('passport');
require('./config/passport')(passport);


// ROUTES
const auth = require('./routes/auth')
const user = require('./routes/user')
const profile = require('./routes/profile')
const message = require('./routes/message')
const room = require('./routes/room')
const mongoose = require("mongoose");

app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

// ROUTES DEFINE
app.use('/api/auth', auth)
app.use('/api/user', user)
app.use('/api/profile', profile)
app.use('/api/message', message)
app.use('/api/room', room)

// Connect MongoDB
const mogoDB = require('mongoose');
require ("./database/mongo")


server.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port", `${process.env.PORT} 🍬`)
})
