module.exports = function(app) {

  var bkfd2Password = require('pbkdf2-password');
  var hasher = bkfd2Password();
  const passport = require('passport');
  const localStrategy = require('passport-local').Strategy;
  const mydb = require('./db')();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new localStrategy(
    function(username, password, done) {
        var uname = username;
        var pword = password;

        var sql = 'SELECT * FROM user WHERE authId=:authId';
        mydb.query(sql, {params:{authId:'local:' + uname}}).then(function(results) {
          console.log('localStrategy results => ' + results.length);
          if(results.length === 0) {
            return done(null, false);
          }
          else {
            var user = results[0];
            //console.log(user);
            // async function
            return (hasher({password:pword, salt:user.salt}, async(err, pass, salt, hash) => {
              if(hash === user.password) {
                //console.log("localStrategy:" + user);
                return done(null, user); //=> passport.serializeUser();
              }
              else {
                return done(null, false, { message: 'Who are you?'});
              }
            }));
          }
        });
    }
  ));

  /**
  * 최초 Login 성공 시 불리는 Callback 함수
  */
  passport.serializeUser(function(user, done) {
    console.log('serializeUser -> ' + user.authId);
    done(null, user.authId);
  });
  /*
  * strategy를 통해서 serialize 에 전달된 식별자를 통해
  * 검사하는 단계....
  */
  passport.deserializeUser(function(id, done) {
    console.log('1. deserializeUser -> ' + id);
    var sql = 'SELECT * FROM user WHERE authId=:authId';
    mydb.query(sql, {params:{authId:id}}).then(function(results) {
      console.log('2. deserializeUser -> ' + results.length);
      if(results.length === 0) {
        done(null, false);
      }
      else {
        done(null, results[0]); // Request에 argument 객체(user)가 포함된다.
      }
    });
  });

  return passport;
}
