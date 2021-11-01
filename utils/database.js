const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
        temperature: Number,
        humidity: Number,
        pressure: Number
    },
    { timestamps: true }
);

const Report = mongoose.model('reports', reportSchema);
const MockReport = mongoose.model('mockReports', reportSchema);

module.exports = {
    Report, MockReport
}
