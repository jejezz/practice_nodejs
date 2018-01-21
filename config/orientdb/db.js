module.exports = function() {
  var orientDB = require('orientjs');
  var dbServer = orientDB({
    host:'localhost',
    port: 2424,
    username: 'root',
    password: '111111'
  });
  var mydb = dbServer.use('Odb');

  return mydb;
}
