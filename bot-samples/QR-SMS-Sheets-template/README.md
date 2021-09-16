# QR Codes, SMS, & Proactive Messaging
In this guide, we'll cover an end-to-end workflow using a chatbot on SMS for marketing purposes. The workflow involves:
1. A consumer scanning a QR code to begin an SMS conversation with the brand's bot
2. A bot integration adding the user's phone number to the [Context Service](https://developers.liveperson.com/conversation-orchestrator-conversation-context-service-overview.html)
3. The brand running a script to create a Proactive Messaging campaign, sending SMS messages to all the collected numbers

As an example, we'll build this out for a venue which wants to attract repeat customers for an underground music night.
## Prerequisites
A basic familiarity with LivePerson Bots is assumed. However, relevant documentation is linked below for your convenience. As well, you can import the bot JSON for this project to save you the trouble of writing the dialogues and building the integration.

- [Create and deploy a bot](https://developers.liveperson.com/tutorials-guides-getting-started-with-bot-building-overview.html) on SMS using the [default Twilio connector](https://knowledge.liveperson.com/getting-started-quick-start-guides-twilio-sms-quick-start.html)
- [Create an SMS QR code](https://www.the-qrcode-generator.com/) pointing toward the Twilio number connected to the Conversational Cloud
- Ensure you have access to [Proactive Messaging](https://knowledge.liveperson.com/messaging-channels-proactive-messaging-proactive-messaging-user-guide.html)

## Workflow
Once we've got our [bot deployed to SMS](https://developers.liveperson.com/conversation-builder-testing-deployment-deploying-to-conversational-cloud.html), we can use the free tool linked above to generate the QR code, and we'll use [our Twilio SMS number](https://knowledge.liveperson.com/getting-started-quick-start-guides-twilio-sms-quick-start.html) which is connected to the Conversational Cloud as the target.

![qr-code](./readme-images/qr-code.png?raw=true)

At our imaginary music venue, we can put up posters with a QR code kicking off an SMS conversation:

![poster](./readme-images/poster.png?raw=true)

You can scan the QR code yourself to get a sense of the user experience, but essentially the QR code automatically:
- Opens the consumer's SMS messaging app
- Fills in the target phone number
- Fills in the message text

The consumer just has to hit send.

![sms1](./readme-images/sms1.png?raw=true)

Now, as each new consumer comes in, we want to save their phone number in the Context Service so that we can proactively reach out to them at a later date.

In the Conversation Builder interaction which will be triggered by the SMS, we'll put the following in either the pre or post process code:

```js
// grab the consumer's phone number
var customerInfo = botContext.getLPCustomerInfo();
var phoneNumber = customerInfo.imei;
// write the consumer's phone number to the context service as the key, with 'true' as the value
var success = botContext.setGlobalContextData("phoneNumbers", phoneNumber, true);
botContext.printDebugMessage("add the phone number to our text list: " + success);
```

When there's an upcoming event and the brand wants to send out the Proactive Messages, we can use a Node.js script which leverages the Context Service and the Proactive Messaging API to create the campaign. In this script you'll define the language included in the message and what skill you want to answer the consumer's response, among other details.

Use the 'proactive.js' file contained in this repository as a template. The steps to run it are included in that file.

The defined message will be sent to all of the collected numbers and the consumer's response will be handled by the defined skill/bot.

![reengagement](./readme-images/reengagement.png?raw=true)








