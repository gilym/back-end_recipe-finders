const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '34.101.60.250',
    user: 'root',
    database: 'recipe-finder',
    password: '12345'
});

module.exports = connection;