const axios = require('axios');
/* 
This script will read collected phone numbers (as keys) from the context store.
If the phone number has a Boolean value of 'true', we'll add it in our list of numbers to send a Proactive Message to.
Then we'll configure our message and send out the bulk Proactive Message.

You'll need Node.js installed on your computer to run this script.
Once you've configured the information below, you can run this script by running the following terminal commands in the directory:
"npm install axios"
"node proactive.js"
*/

// ACTION NEEDED! configure key variables for the API calls:
const contextDomain = ""; // will be 'z1' for North America (check here: https://developers.liveperson.com/domain-api.html and search 'maven')
const sentinelDomain = "" // will be 'va' for North America (check here: https://developers.liveperson.com/domain-api.html and search 'sentinel')
const accountId = "";
const nameSpace = ""; // the same namespace you're using to capture the phone number in the bot
const mavenKey = ""; // steps to get your key here: https://developers.liveperson.com/conversation-orchestrator-api-authorization.html. Keep it secure using an environment variable
const clientId = ""; // steps to get the client id and client secret here: https://developers.liveperson.com/proactive-messaging-api.html. Keep this secure using an environment variable
const clientSecret = ""; // Keep this secure using an environment variable

// ACTION NEEDED! configure key variables for the Proactive Messaging Campaign:
// the message content:
const proactiveMessage = "Hot show this Friday! Reply TIX to secure your spot today. To stop receiving messages, reply STOP. For help, reply HELP.";
// the name of the skill you want to handle the consumer's responses:
const skill = "";
// the Twilio number integrated into your LivePerson account which will send the messages:
const twilioNumber = "";

// grab all collected phone numbers who want texts and return them formatted into an array
    axios({
        method: 'get',
        url: `https://${contextDomain}.context.liveperson.net/v1/account/${accountId}/${nameSpace}/properties`,
        headers: {
        'Content-Type': 'application/json',
        'maven-api-key': mavenKey
        },
    })
    .then(response => {
        let numbersObject = response.data;
        let allNumbers = [];
        let trueNumbers = [];
        for (var i in numbersObject)
            allNumbers.push([i, numbersObject[i]]);
        allNumbers.map(number => {
            if (number[1] == true) {
                trueNumbers.push(number[0])
            }
        })
        return trueNumbers;
    })
// format the data to send to the Proactive Messaging API
    .then(numbers => {
        let consumers = [];
        numbers.map(number => {
            consumers.push({
                "consumerContent": {"sms": number},
                "variables": {
                    "1": proactiveMessage
                }
            })
        })
        return consumers;
    })
// create the proactive campaign
    .then(formattedConsumers => {
        let payload = {
            "campaignName": "secret_show_campaign",
            "skill": skill, //
            "templateId": "1234567890", // use this templateId for SMS campaigns
            "outboundNumber": twilioNumber,
            "consent": true,
            "consumers": formattedConsumers
        }
        // get the JWT key to authorize with the Proactive Messaging API
        axios({
            method: 'post',
            url: `https://${sentinelDomain}.sentinel.liveperson.net/sentinel/api/account/${accountId}/app/token?v=1.0&grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                },
        })
        .then(response => {
            let JWTkey = response.data.access_token;
            return JWTkey
        })
        .then(JWTkey => {
            axios({
                method: 'post',
                url: `https://proactive-messaging.${contextDomain}.fs.liveperson.com/api/v2/account/${accountId}/campaign`,
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTkey}`
                },
                data: payload
            })
            .catch(error => {
                console.log(error)
            })
        })
    })
