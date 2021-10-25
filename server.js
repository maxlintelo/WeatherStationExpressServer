// Retrieve enviroment variables
require('dotenv').config();
const URL = process.env.DB_URI;
const PORT = process.env.PORT || "8081";

// Make express server
const express = require("express");
const app = express();
const cors = require("cors");

// Create DB Object
const mongoose = require('mongoose');

// Configure Express Server
app.use(cors({ origin: "htpp://localhost:8081" })); // cross origin resource sharing
app.use(express.json()); // json data response
app.use(express.urlencoded({ extended: true }));

// Connect to DB
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connected to the database.`);
}).catch(err => {
    console.log(`Cannot connect to the database.`, err);
    process.exit()
});

// API Controllers
app.get('/', function(req, res) {
    res.send("OK");
});
app.use('/api', require('./routes/api.routes'));

// Entry point
if (require.main === module) {
    console.log('Started as entrypoint...')
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}.`) });
}
