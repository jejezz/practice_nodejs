
/**
  MAIN APPLICATION
  Application entry point......

  @file app_session.js
  @author Jongyun Ahn
*/

//////////////////////////////////////////////
const app = require('./config/orientdb/express')();
//////////////////////////////////////////////
var passport = require('./config/orientdb/passport')(app);
var auth = require('./routes/orientdb/auth')(passport);
var topic = require('./routes/topic/topic')();
app.use('/auth', auth);
app.use('/topic', topic);
app.set('view engine', 'pug');
app.set('views', './views/orientdb');
//////////////////////////////////////////////
app.locals.pretty = true;
app.get('/', function(req, res) {
    res.redirect('/welcome');
})

app.get('/welcome', function(req, res) {
  if(req.user && req.user.displayName) {
    res.redirect('/topic');
  }
  else {
    res.redirect('/auth/login');
  }
});

//////////////////////////////////////////////
app.listen(3003, function() {
  console.log("Connected, http://localhost:3003/")
})
