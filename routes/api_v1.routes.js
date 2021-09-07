var express = require('express');
const { report } = require('../models');
var apiv1 = express.Router();

// Import DB and model
const db = require('../models');
const Report = db.report;

// Put a new reading in DB (POST /api/v1)
apiv1.post('/', function(req, res) {
    // Check if title is empty
    if (!req.body.title) {
        res.status(400).send({message: 'Content cannot be empty.'});
        return;
    }
    
    // Create report object
    const report = new Report({
        title: req.body.title,
        temperature: req.body.temperature,
        pressure: req.body.pressure
    });

    // Save object to DB
    report.save(report)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ "An error occured while saving the report to the database. " + err });
    });
});

// Get all readings (GET /api/v1/)
apiv1.get('/', function(req, res) {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    report.find(condition)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ "An error occurred while retrieving reports. " + err });
    });
});

// Get reading by id (GET /api/v1/:id)
apiv1.get('/:id', function(req, res) {
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
apiv1.put('/:id', function(req, res) {
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

module.exports = apiv1;
