const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database: 'saboroso',
    password: 'rdopvtmc03394579'
})


module.exports = connection