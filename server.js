const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const { URL } = require('./database')

var corsOptions = {
    origin: "htpp://localhost:8081",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Connect to prodcution DB
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
app.use('/', require('./routes/index.routes'))
app.use('/api/v1', require('./routes/api_v1.routes'));
app.use('/api/v2', require('./routes/api_v2.routes'));
app.use('/api/mock', require('./routes/api_mock.routes'));

// Entry point
if (require.main === module) {
    console.log('Started as entrypoint...')
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`)
    });
}
