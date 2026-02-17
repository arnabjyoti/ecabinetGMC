//const async = require("async");





require('dotenv').config()
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)


module.exports = {

    async sendMessage() {
        const message = await twilio.messages.create({
            body: 'Hello this is a text message using Twilio with node JS',
            from: '+16812753356',
            to: process.env.PHONE_NUMBER
        })
        console.log(message);
    }



};
