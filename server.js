// Required dependencies
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const hbsHelpers = require("handlebars-helpers")();


// Import routes
const routes = require("./controllers");
const sequelize = require('./config/connection');

// Set up the Express app
const app = express();
const PORT = process.env.PORT || 3000;

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true
  // store: new SequelizeStore({
  //   db: sequelize
  // })
};

// Set up session
app.use(session(sess));

// Set up Handlebars as the template engine
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    // Define the formatDate helper
    log: function (context) {
      console.log(context);
    },
    formatDate: function (date) {
      if (!date) return ""; // Handle empty date gracefully
      const parsedDate = new Date(date);
      return isNaN(parsedDate) ? "" : parsedDate.toISOString().slice(0, 10);
    },
  },
}));
app.set("view engine", "handlebars");

// Set up Express middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "public")));

// Set up routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});