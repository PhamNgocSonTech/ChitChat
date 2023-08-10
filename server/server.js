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


// ROUTES
const auth = require('./routes/auth')

app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());

// ROUTES DEFINE
app.use('/api/auth', auth)

// Connect MongoDB
const mogoDB = require('mongoose');
require ("./database/mongo")

server.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port", `${process.env.PORT} 🍬`)
})
