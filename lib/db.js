var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dkd352487',
    database: 'BOARD'
});
db.connect();

module.exports = db;