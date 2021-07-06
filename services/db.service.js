var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'be6d4851b3a4ec',
    password: 'ce6e6dae',
    database: 'heroku_5188455ad9124e3'
});

pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    // console.log('The solution is: ', results[0].solution);
    console.log('connected to SQL server');
});

function runSQL(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    })
}

module.exports = {
    runSQL
}