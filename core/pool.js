const util = require('util');
const mysql = require('mysql');

const pool = mysql.createPool({
    user: 'vlad_f',
    host: 'localhost',
    port: 3306,
    password: '20122000vl',
    database: 'quizee'
});

//test connection
pool.getConnection((error, connection)=>{
    if (error){
        console.log('failed to connect to the database...');
    }
    if(connection){
        connection.release();
    }
});

//making queries async.
pool.query = util.promisify(pool.query);

module.exports = pool;