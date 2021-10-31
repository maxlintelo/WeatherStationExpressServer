const https = require('https');

// Get wundermap credentials from .ENV file
const WUNDERMAP_ID = process.env.WUNDERMAP_ID;
const WUNDERMAP_PW = process.env.WUNDERMAP_PW;

sendData = function(temperature, humidity, pressure) {
    // Check if credentials are found
    if (!(WUNDERMAP_ID && WUNDERMAP_PW)) {
        console.log("Error: No wundermap ID and/or password in .env file.");
        return;
    }

    // Generate URL to post to
    var uri = "https://weatherstation.wunderground.com/weatherstation/updateweatherstation.php?ID=" + WUNDERMAP_ID + "&PASSWORD=" + WUNDERMAP_PW + "&dateutc=now&action=updateraw";
    uri += "&tempf=" + (parseInt(temperature) * 1.8 + 32);
    uri += "&humidity=" + humidity;
    uri += "&baromin=" + (parseInt(pressure) / 1000 * 29.6133971008);

    // Send the request
    https.get(uri, (res) => {
        // Get response
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        // When finished
        res.on('end', () => {
            // If return message is not 'success' throw error
            data = data.replace('\n', '');
            if (data != "success") {
                console.log("Wundermap returned an error while posting data. " + data);
            }
        });
    }).on("error", (err) => {
        // Unknown error log
        console.log("Unknown error posting data to wundermap. " + err.message);
    });
};

module.exports = sendData;