const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database: 'saboroso',
    password: '03394579',
    multipleStatements :true
    
})


module.exports = connection