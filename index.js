const Joi = require('joi');
const express = require('express');
const app = express();
const router = express.Router()
const fs = require('fs');
const data = require('./data');
const client = require('./database');
const body_parser = require('body-parser');
const PORT = process.env.PORT || 3000;
const redis = require("redis");
const responseTime = require('response-time');
app.use(express.json());
client.connect();
const express_handlebars = require("express-handlebars");



//redis 
let redisPort = 6379;
let redisHost = "127.0.0.1";
const redisClient = redis.createClient({

    port: redisPort,
    host: redisHost,

});

(async() => {
    // Connect to redis server
    await redisClient.connect();
})();


console.log("Attempting to connect to redis");
redisClient.on('connect', () => {
    console.log('Connected!');
});

// Log any error that may occur to the console
redisClient.on("error", (err) => {
    console.log(`Error:${err}`);
});
//redis




/////////////////////////////////////////////////



app.get('/', (req, res) => {
    res.send('Hello Word');
})

//get all data
app.get('/api/educations', (req, res) => {

    client.query(`Select * from educations`, (err, result) => {
        if (err) {
            console.log("there is no educations");
        } else {

            res.status(200).send(result.rows);
            console.log(result.rows);
        }
        client.end;
    })

});





//get data with id
app.get('/api/educations/:id', (req, res) => {


    redisClient.hGetAll(req.params.id).then(response => {
        res.send(response["name"])
    }).catch(err => {
        console.log(err);
        res.send(err);
    });


    // client.query(`Select * from educations where id =${req.params.id}`, (err, result) => {
    //     if (err) {
    //         res.status(404).send("education with this id was not exist");
    //         console.log(err.message);
    //     } else {
    //         res.status(200).send(result.rows);
    //         console.log(result.rows);
    //     }
    //     client.end;
    // })

});



// insert data
app.post('/api/educations', async(req, res) => {

    const education = req.body;
    client.query(`Insert into educations(id,name,phone) values('${education.id}','${education.name}','${education.phone}')`, (err, result) => {
        if (err) {
            res.status(400).send('can not insert data');
            console.log(err.message);
        } else {
            // set data to redis
            // redisClient.setEx(education.name, 3600, education.phone);
            const id = req.body.id;
            const name = req.body.name;
            const phone = req.body.phone;


            redisClient.HSET(id, [

                'name', name,
                'phone', phone

            ], (err, res) => {
                if (err) {
                    console.log("error fetch data");
                } else {
                    console.log("its work ok");
                }
            });
            // set redis to redis
            res.status(200).send("education inserted successfully")
            console.log("education added" + education.name)
        }

        client.end;

    });

});


//update data
app.put('/api/educations/:id', (req, res) => {

    const education = req.body;
    const updateQuery = `update educations set name = '${education.name}',phone ='${education.phone}' where id = ${req.params.id}`

    client.query(updateQuery, (err, result) => {
        if (err) {
            console.log("faild update", err.message)
        } else {

            res.send('Update was successful')
        }
        client.end;

    })

});


//delete data
app.delete('/api/educations/:id', (req, res) => {
    client.query(`delete from educations where id=${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err.message);
            result.send("can not delete")
        } else {
            console.log("id " + req.params.id + " deleted");
            res.send("id " + req.params.id + " deleted");
        }
    })
})


///validate v input
// function validateEducation(education) {
//     const schema = Joi.object({
//         name: Joi.string().min(3).required()
//     })
//     return Joi.validate(education, schema)

// }






app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}...`);
});