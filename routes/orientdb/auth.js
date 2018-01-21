
module.exports = function(passport) {
  var bkfd2Password = require('pbkdf2-password');
  var hasher = bkfd2Password();
  var mydb = require('../../config/orientdb/db')();
  var route = require('express').Router();

  route.get('/login', function(req, res) {
    var sql = `SELECT * FROM topics`;
    mydb.query(sql).then(function(_topics){
        res.render('./auth/login', {topics:_topics});
    }, function(error) {
        res.status(500);
    });
  });

  route.get('/login/failure', function(req, res) {
    var sql = `SELECT * FROM topics`;
    mydb.query(sql).then(function(_topics){
        res.render('./auth/login_failure', {topics:_topics});
    }, function(error) {
        res.status(500);
    });
  });

  route.post('/login',
    passport.authenticate('local', { successRedirect: '/welcome',
                                     failureRedirect: '/auth/login/failure',
                                     failureFlash: false })
  );

  route.get('/logout', function(req, res) {
    console.log("1. logged out-------" + req.user);
    req.logout();
    console.log("2. logged out-------" + req.user);
    req.session.save(function() {
      res.redirect('/welcome');
    });
  });

  /**
  */
  route.post('/register', function(req, res) {
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
      var user = {
        authId: 'local:'+req.body.username,
        username: req.body.username,
        password: hash,
        salt: salt,
        displayName: req.body.displayName,
      } //user

      var sql = 'INSERT INTO user (authId, username, password, salt, displayName) VALUES(:authId, :username, :password, :salt, :displayName)';

      mydb.query(sql, {params:user}).then(function(result){
        req.login(user, function(err) {
          req.session.save(function() {
            res.redirect('/welcome');
          }); //req.session.save
        });
      }, function(error) {
        console.log(error);
        res.status(500);
      });
    }); //hasher
  }); // post('/auth/register')

  route.get('/register', function(req, res) {
    var sql = `SELECT * FROM topics`;
    mydb.query(sql).then(function(_topics){
        res.render('./auth/register', {topics:_topics});
    }, function(error) {
        res.status(500);
    });
  });

  return route;
}
