var express = require('express');
var apiv1 = express.Router();
const { Report } = require('../database');

// Put a new reading in DB (POST /api/v1)
apiv1.post('/', function(req, res) {
    // Check if request temperature or humidity is empty
    if (!req.body.temperature || !req.body.humidity || !req.body.pressure) {
        res.status(400).send({message: 'Supply temperature, humidity and pressure.'});
        return;
    }
    
    // Create report object
    const reportData = [{
        temperature: req.query.temperature,
        humidity: req.query.humidity,
        pressure: req.query.pressure,
    }]

    // Save object to DB
    Report.insertMany(reportData)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: "An error occured while saving the report to the database. " + err });
    });
});

// Get all readings (GET /api/v1/)
apiv1.get('/', function(req, res) {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    var limit = 0;
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }

    Report.find(condition)
    .sort({_id:-1})
    .limit(limit)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: "An error occurred while retrieving reports. " + err });
    });
});

// Get reading by id (GET /api/v1/:id)
apiv1.get('/:id', function(req, res) {
    const id = req.params.id;

    Report.findById(id)
    .then(data => {
        if (!data) {
            res.status(404).send({ message: "No report with id " + id + "."});
        } else {
            res.send(data);
        }
    })
    .catch(err => {
        res.status(500).send({ message: "Error retrieving report with id " + id + ". " + err });
    });
});

// Update report by ID (PUT /api/v1/:id)
apiv1.put('/:id', function(req, res) {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cannot be empty." });
    }
    const id = req.params.id;
    
    Report.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
            res.status(404).send({ message: `Could not find a report with id ${id}.` });
        } else {
            res.send({ message: "Report was updated successfully." });
        }
    })
    .catch(err => {
        res.status(500).send({ message: "Unknown error updating report with id " + id + ". " + err });
    });
});

module.exports = apiv1;
