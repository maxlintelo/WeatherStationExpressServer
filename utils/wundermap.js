const https = require('https');
const { parse } = require('path');

const WUNDERMAP_ID = process.env.WUNDERMAP_ID;
const WUNDERMAP_PW = process.env.WUNDERMAP_PW;

sendData = function(temperature, humidity, pressure) {
    if (!(WUNDERMAP_ID && WUNDERMAP_PW)) {
        console.log("Error: No wundermap ID and/or password in .env file.");
        return;
    }
    var uri = "https://weatherstation.wunderground.com/weatherstation/updateweatherstation.php?ID=" + WUNDERMAP_ID + "&PASSWORD=" + WUNDERMAP_PW + "&dateutc=now&action=updateraw";
    uri += "&tempf=" + (parseInt(temperature) * 1.8 + 32);
    uri += "&humidity=" + humidity;
    // Ervanuitgaande dat druk in Pascal wordt gegeven door sensor
    // TODO check
    // To Inch Mercury
    uri += "&baromin=" + (parseInt(pressure) / 1000 * 29.6133971008);

    https.get(uri, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            data = data.replace('\n', '');
            if (data != "success") {
                console.log("Wundermap returned on error while posting data. " + data);
            }
        });
    }).on("error", (err) => {
        console.log("Unknown error posting data to wundermap. " + err.message);
    });
};

module.exports = sendData;