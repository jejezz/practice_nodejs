module.exports = function() {
  var orientDB = require('orientjs');
  var dbServer = orientDB({
    host:'210.120.112.144',
    port: 2424,
    username: 'root',
    password: '77887788'
  });
  var mydb = dbServer.use('Odb');

  return mydb;
}
