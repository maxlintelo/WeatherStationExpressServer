var express = require('express');
const { report } = require('../models');
var apiv2 = express.Router();

// Import DB and model
const db = require('../models');
const Report = db.report;

// Put a new reading in DB (POST /api/v1)
apiv2.post('/', function(req, res) {
    // Check if request temperature or humidity is empty
    if (!req.body.temperature || !req.body.humidity) {
        res.status(400).send({message: 'Supply temperature and humidity.'});
        return;
    }
    
    // Create report object
    const report = new Report({
        temperature: req.body.temperature,
        humidity: req.body.humidity
    });

    // Save object to DB
    report.save(report)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: "An error occured while saving the report to the database. " + err });
    });
});

// Get all readings (GET /api/v1/)
apiv2.get('/', function(req, res) {
    // If new temp, humid, and pressure is submitted
    if (req.query.temperature && req.query.humidity && req.query.pressure) {
        // Create report object
        const report = new Report({
            temperature: req.query.temperature,
            humidity: req.query.humidity,
            pressure: req.query.pressure,
        });
        // Log values to console
        console.log("Temprature:" + req.query.temperature);
        console.log("Humidity:" + req.query.humidity);
        console.log("Pressure:" + req.query.pressure);

        // Save object to DB
        report.save(report)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "An error occured while saving the report to the database. " + err });
        });
    }
    // Else data needs to be retrieved
    else {
        const title = req.query.title;
        var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

        var limit = 0;
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }

        report.find(condition)
        .sort({_id:-1})
        .limit(limit)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "An error occurred while retrieving reports. " + err });
        });
    }
});

// Get reading by id (GET /api/v1/:id)
apiv2.get('/:id', function(req, res) {
    const id = req.params.id;

    report.findById(id)
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
apiv2.put('/:id', function(req, res) {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cannot be empty." });
    }
    const id = req.params.id;
    
    report.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

module.exports = apiv2;
