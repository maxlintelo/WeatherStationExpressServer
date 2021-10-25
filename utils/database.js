const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
        temperature: String,
        humidity: String,
        pressure: String
    },
    { timestamps: true }
);

const Report = mongoose.model('reports', reportSchema);
const MockReport = mongoose.model('mockReports', reportSchema);

module.exports = {
    Report, MockReport
}
