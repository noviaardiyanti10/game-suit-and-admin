const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
require("dotenv").config();
const app = express();
const router = require('./routes/router');
const session = require("express-session");
const flash = require('connect-flash');


app.use(session({
    secret: 'secret word in use',
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: 43200000
    }
}));

app.use(flash());

const { PORT = 4000 } = process.env;


app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.static(path.join(__dirname, 'view')));
app.set('view engine', 'ejs');


//set body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);


app.use(router);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));