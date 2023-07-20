const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const SESSION_SECRET = 'COMP5347-WebDev18';
const SESSION_COOKIE_MAX_AGE = 1 * 24 * 60 * 60 * 1000;  // Session cookies expire after one day

const CORS_WHITELIST = ["http://localhost:8080"];
const CORS_OPTIONS = {
    origin: (origin, callback) => {
        callback(null, true);
        // if (CORS_WHITELIST.indexOf(origin) !== -1) {
        //     callback(null, true);
        // } else {
        //     callback(new Error('Not allowed by CORS'));
        // }
    },
    credentials: true
}

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors(CORS_OPTIONS));
app.options('*', cors(CORS_OPTIONS));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "SellPhone.session",
    cookie: { 
        secure: false,
        maxAge: SESSION_COOKIE_MAX_AGE 
    }
}));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
