var mysql = require('mysql');

// var connection = mysql.createConnection({
//     host: 'us-cdbr-east-03.cleardb.com',
//     user: 'be6d4851b3a4ec',
//     password: 'ce6e6dae',
//     database: 'heroku_5188455ad9124e3'
// });

// connectSql()

// function connectSql() {
//     console.log('// im here - 0 //');
//     connection.connect(err => {
//         if (err) {
//             console.log('// im here - 1 //');
//             if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//                 console.log('// im here - 2 //');
//                 connection.end();
//                 setTimeout(() => connectSql(), 500)

//             } else throw new Error('mySql failed connection');
//         }
//         else console.log('connected to SQL server');
//     })
// }


var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'be6d4851b3a4ec',
    password: 'ce6e6dae',
    database: 'heroku_5188455ad9124e3'
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
    console.log('connected to SQL server');
});



function runSQL(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results);
            // not entirely clear on whether connection.end() should be called here or not.
            // Leaning towards not.
            // connection.end();
        });
    })
}

module.exports = {
    runSQL
}