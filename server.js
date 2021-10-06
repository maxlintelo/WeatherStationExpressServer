// Initialize DotEnv ENV Variables
require('dotenv').config();
// Retrieve enviroment variables
const URL = process.env.URL || "No URL in .env";
const PORT = process.env.PORT || "8081";

// Make express server
const express = require("express");
const app = express();
const cors = require("cors");

// Create DB Object
const mongoose = require('mongoose');

// Configure Express Server
app.use(cors({ origin: "htpp://localhost:8081" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connected to the database.`);
}).catch(err => {
    console.log(`Cannot connect to the database.`, err);
    process.exit()
});

// API Controllers
app.use('/', require('./routes/index.routes'))
app.use('/api/v1', require('./routes/api_v1.routes'));
app.use('/api/v2', require('./routes/api_v2.routes'));
app.use('/api/mock', require('./routes/api_mock.routes'));

// Entry point
if (require.main === module) {
    console.log('Started as entrypoint...')
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}.`) });
}
