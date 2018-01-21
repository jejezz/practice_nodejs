module.exports = function() {

  const mydb = require('../../config/orientdb/db')();
  var route = require('express').Router();

  route.get('/add', function(req, res) {
    var sql = `SELECT * FROM topics`;
    mydb.query(sql).then(function(_topics){
        res.render('./topics/add', {topics:_topics, user:req.user});
    }, function(error) {
        res.status(500);
    });
  });

  route.post('/add', function(req, res) {
    var _title = req.body.title;
    var _description = req.body.description;
    var _author = req.body.author;
    var _sql = `INSERT INTO topics (title, description, author, datetime)
      VALUES (:title, :description, :author, :datetime)`;
    var d = new Date();
    var _datetime = d.getFullYear()+'-'+ (d.getMonth()+1) + '-'
      + d.getDate() + ' ' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log(_datetime);
    mydb.query(_sql,
      {
        params:{
          title:_title,
          description:_description,
          author:_author,
          datetime: _datetime
        }}).then(function(result) {
          var rid = result[0]['@rid'];
          res.redirect('/topics/'+encodeURIComponent(rid));
        }, function(error) {
          res.status(500);
        });
  })

  route.get(['/', '/:id'], function(req, res) {
      var sql = `SELECT * FROM topics`;
      mydb.query(sql).then(function(_topics){
        var id = req.params.id;
        if(id) {
          var sql = `SELECT * FROM topics WHERE @rid=:rid`;
          mydb.query(sql, {params:{rid:id}}).then(function(_topic){
            res.render('./topics/topic', {topics:_topics, topic:_topic[0], user:req.user});
          });
        }
        else {
          res.render('./topics/topic', {topics:_topics, user:req.user});
        }
      }, function(error) {
          res.status(500);
      });

  });

  return route;
}
