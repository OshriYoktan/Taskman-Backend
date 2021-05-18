var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'be6d4851b3a4ec',
    password: 'ce6e6dae',
    database: 'heroku_5188455ad9124e3',
});

connection.connect(err => {
    if (err) throw new Error('mySql failed connection');
    console.log('connected to SQL server');
})

function runSQL(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results);
            // // not entirely clear on whether connection.end() should be called here or not.
            // // Leaning towards not.
            // connection.end();
        });
    })
}

module.exports = {
    runSQL
}