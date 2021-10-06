var express = require('express');
var apivmock = express.Router();
const { MockReport } = require('../database');
const logging = require('../logging');

// Get all readings (GET /api/v1/)
apivmock.get('/', function(req, res) {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    var limit = 0;
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }

    MockReport.find(condition)
    .sort({_id:-1})
    .limit(limit)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: "An error occurred while retrieving reports. " + err });
    });
});

// Get all readings (GET /api/v1/)
apivmock.get('/post', function(req, res) {
    // If new temp, humid, and pressure is submitted
    if (req.query.temperature && req.query.humidity && req.query.pressure) {
        // Create report object
        const reportData = [{
            temperature: req.query.temperature,
            humidity: req.query.humidity,
            pressure: req.query.pressure,
        }]
        logging.logDevelopmentRequest(reportData);

        // Save object to DB
        MockReport.insertMany(reportData)
        .then(data => {
            logging.logDevelopmentResponse(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "An error occured while saving the report to the database. " + err });
        });
    }
    // Else data needs to be retrieved
    else {
        res.status(400).send("Provide a temperature, humidity and pressure.");
    }
});

// Get reading by id (GET /api/v1/:id)
apivmock.get('/:id', function(req, res) {
    const id = req.params.id;

    MockReport.findById(id)
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
apivmock.put('/:id', function(req, res) {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cannot be empty." });
    }
    const id = req.params.id;
    
    MockReport.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

module.exports = apivmock;
