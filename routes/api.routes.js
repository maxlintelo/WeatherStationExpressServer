var apiRouter = require('express').Router();

// All API routes in one file
apiRouter.get('/', function(req, res) { res.send("Most recent API: /api/v3"); });
apiRouter.use('/v1', require('./_v1'));
apiRouter.use('/v2', require('./_v2'));
apiRouter.use('/v3', require('./_v3'));
apiRouter.use('/mock', require('./_mock'));

module.exports = apiRouter;