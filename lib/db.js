var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'opentutorials'
});
db.connect();

module.exports = db;