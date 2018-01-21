module.exports = function() {
  //////////////////////////////////////////////
  const express = require('express');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const fileStore = require('session-file-store')(session); // depedency on session
  const sha256 = require('sha256');
  const bkfd2Password = require('pbkdf2-password');
  const hasher = bkfd2Password();
  const orientoStore = require('connect-oriento')(session); // dependancy on session
  const app = express();
  //////////////////////////////////////////////
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'asd91908723kd8ufy889yuf',
    resave: false,
    saveUninitialized: true,
    store: new orientoStore({
          server: "host=210.120.112.144&port=2424&username=root&password=77887788&db=Odb"
      })
    //cookie: { secure: true } // this is for https
  }));

  return app;
};
