var indexRouter = require('express').Router();

// Get all readings (GET /api/v1/)
indexRouter.get('/', function(req, res) {
    res.status(200).send("API Up and running.");
});

module.exports = indexRouter;
