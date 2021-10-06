module.exports = {
    logProductionRequest: function(request) {

    },
    logDevelopmentRequest: function(response) {
        var temperature = response[0].temperature;
        var humidity = response[0].humidity;
        var pressure = response[0].pressure;
        console.log('--------------- RECEIVING REQUEST ---------------');
        console.log(`Sending request to MongoDB Mock DB:\n* Temperature: "${temperature}"\n* Humidity: "${humidity}"\n* Pressure: "${pressure}"`);
        console.log('--------------- REQUEST RECEIVED  ---------------');
    },
    logProductionResponse: function(request) {

    },
    logDevelopmentResponse: function(response) {
        console.log('--------------- SENDING RESPONSE ---------------');
        console.log(`Received response from MongoDB Mock DB:\n"${response}"\nForwarding to requesting client.`);
        console.log('---------------   REPONSE SENT   ---------------');
    },
};