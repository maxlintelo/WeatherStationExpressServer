const express = require("express");
const cors = require("cors");
const db = require("./models");
var helmet = require("helmet");

const app = express();

var corsOptions = {
    origin: "htpp://localhost:8081",
};

app.use(helmet())
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Connect to DB
db.mongoose.connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
}).then(() => {
        console.log(`Connected to the database at ${db.url}.`)
}).catch(err => {
        console.log(`Can not connect to the database at ${db.url}.`, err);
        process.exit()
});

// API Controllers
app.use('/api/v1', require('./routes/api_v1.routes.js'));
app.use('/api/v2', require('./routes/api_v2.routes.js'));

// Simple router
app.get("/", (req, res) => {
    res.json({message: "Hello, world!"});
});

// Start server
if (require.main === module) {
    console.log('Started as entrypoint...')
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`)
    });
}
