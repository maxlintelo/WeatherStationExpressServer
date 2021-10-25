var express = require('express');
var apiv2 = express.Router();
const { Report } = require('../utils/database');

/*
 * This functions adds a new sensor reading to the database.
 * Query parameters:
 * - temperature (int)
 * - humidity (int)
 * - pressure (int)
 * Request parameters:
 * - none
 */
apiv2.get('/post', function(req, res) {
    // Check if the request query contains all values
    var { temperature, humidity, pressure } = req.query;
    if (!(temperature && humidity && pressure)) {
        res.status(400).send("Provide a temperature, humidity, and pressure.");
    }

    // Create a report object
    const reportData = [{
        temperature: temperature,
        humidity: humidity,
        pressure: pressure,
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

/*
 * This functions retrieves items from the database
 * Query parameters:
 * - limit (int)
 * - condition (regex)
 * Request parameters:
 * - none
 */
apiv2.get('/', function(req, res) {
    var { title, limit } = req.query;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    if (limit) {
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

/*
 * This functions retrieves items from the database
 * Query parameters:
 * - none
 * Request parameters:
 * - id (int)
 */
apiv2.get('/:id', function(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).send("Provide an id to search for.");
    }

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

module.exports = apiv2;
