require("dotenv").config();
const logger = require('morgan');
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport-config");
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);

module.exports = {
  init(app, express){
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(logger('dev'));
    app.use(expressValidator());
    app.use(session({
    //  secret: process.env.cookieSecret,
      secret: "do not let this get checked into version control",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 } //set cookie to expire in 14 days
    }));
    app.use(flash());
    passportConfig.init(app);

    app.use((req,res,next) => {
      res.locals.currentUser = req.user;
      next();
    })
  }

};
