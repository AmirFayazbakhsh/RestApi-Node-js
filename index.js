const Joi = require('joi');
const express = require('express');
const app = express();
const router = express.Router()
const fs = require('fs');
const data = require('./data');
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello Word');
})

//get all data
app.get('/api/educations', (req, res) => {
    res.send(data)
});

//get data with id
app.get('/api/educations/:id/', (req, res) => {
    const education = data.find(education => education.id === parseInt(req.params.id))
    if (!education) {
        return res.status(404).send('education with this id was not exist')
    }
    res.send(education)
});

// insert data
app.post('/api/educations', (req, res) => {

    const { error } = validateEducation(req.body) //from validate function


    if (error) {
        // console.log(result.error.details[0].message)
        res.status(400).send(error.details[0].message)
        return;
    }

    const education = {
        id: data.length + 1,
        name: req.body.name + (data.length + 1)
    }
    data.push(education);
    res.send(education)
});


//update data
app.put('/api/educations/:id', (req, res) => {

    const education = data.find(education => education.id === parseInt(req.params.id))
    if (!education) {
        return res.status(404).send('education with this id was not exist')
    }

    const { error } = validateEducation(req.body) //from validate function

    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    education.name = req.body.name
    res.send(education)
});


//delete data
app.delete('/api/educations/:id', (req, res) => {

    const education = data.find(education => education.id === parseInt(req.params.id))
    if (!education) {
        return res.status(404).send('education with this id was not exist')
    }

    const index = data.indexOf(education)
    data.splice(index, 1)
    res.send(education)

})


///validate v input
function validateEducation(education) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return Joi.validate(education, schema)

}





const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}...`)
});