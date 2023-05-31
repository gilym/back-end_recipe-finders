const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '34.101.114.69',
    user: 'root',
    database: 'recipe-finders',
    password: '12345'
});

module.exports = connection;