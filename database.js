const { Client } = require('pg');


const client = new Client({

    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "newpassword",
    database: "postgres"
});

// client.connect()

// client.query(`Select * from educations where id = 1`, (err, res) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(res.rows);
//     }
//     client.end;
// })

module.exports = client