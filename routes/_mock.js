var express = require('express');
var mockapi = express.Router();
const { MockReport } = require('../utils/database');

const TEMP_HIGH_BOUND = parseInt(process.env.TEMP_HIGH_BOUND || 50);
const TEMP_LOW_BOUND = parseInt(process.env.TEMP_LOW_BOUND || -50);
const HUMI_HIGH_BOUND = parseInt(process.env.HUMI_HIGH_BOUND || 100);
const HUMI_LOW_BOUND = parseInt(process.env.HUMI_LOW_BOUND || 0);
const PRES_HIGH_BOUND = parseInt(process.env.PRES_HIGH_BOUND || 1200);
const PRES_LOW_BOUND = parseInt(process.env.PRES_LOW_BOUND || 800);

/*
 * This functions adds a new sensor reading to the database.
 * Query parameters:
 * - temperature (int)
 * - humidity (int)
 * - pressure (int)
 * Request parameters:
 * - none
 */
mockapi.get('/post', function(req, res) {
    // Check if the request query contains all values
    var { temperature, humidity, pressure } = req.query;
    if (!(temperature && humidity && pressure)) {
        res.status(400).send("Provide a temperature, humidity, and pressure.");
        return;
    }

    // Check for valid values
    if (temperature < TEMP_LOW_BOUND || temperature > TEMP_HIGH_BOUND) {
        res.status(500).send("Provide a temperature between " + TEMP_LOW_BOUND + " and " + TEMP_HIGH_BOUND + ".");
        return;
    }
    if (humidity < HUMI_LOW_BOUND || humidity > HUMI_HIGH_BOUND) {
        res.status(500).send("Provide a humidity between " + HUMI_LOW_BOUND + " and " + HUMI_HIGH_BOUND + ".");
        return;
    }
    if (pressure < PRES_LOW_BOUND || pressure > PRES_HIGH_BOUND) {
        res.status(500).send("Provide a pressure between " + PRES_LOW_BOUND + " and " + PRES_HIGH_BOUND + ".");
        return;
    }

    // Create a report object
    const reportData = [{
        temperature: temperature,
        humidity: humidity,
        pressure: pressure,
    }]

    // Save object to DB
    MockReport.insertMany(reportData)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: "An error occured while saving the report to the database. " + err });
    });
});

/*
 * This functions retrieves items from the database
 * Query parameters:
 * - limit (int)
 * - condition (regex)
 * Request parameters:
 * - none
 */
mockapi.get('/', function(req, res) {
    var { title, limit } = req.query;
    limit = limit ? parseInt(limit) : 0;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    if (isNaN(limit)) {
        res.status(500).send({ message: "An error occurred while retrieving reports. Limit should be a integer." });
        return;
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

/*
 * This functions retrieves items from the database
 * Query parameters:
 * - none
 * Request parameters:
 * - id (int)
 */
mockapi.get('/:id', function(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).send("Provide an id to search for.");
    }

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

module.exports = mockapi;
