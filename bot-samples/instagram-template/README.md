# Instagram Starter Guide
This guide includes:
- A bot template for Instagram which can detect which "entry point" the consumer is accessing the bot through, and route to a corresponding Dialog
- A guide to integrating LivePerson with Instagram (accurate as of Oct 2021)
- A video of a practical example in action

The template should help you get up and running quickly with LivePerson's Instagram integration.

### Prerequisites

- Access to the Conversational Cloud and a basic knowledge of LivePerson bots
- A Facebook Business Page [connected to an Instagram account](https://www.facebook.com/help/1148909221857370)
- The Instagram account should [allow access to direct messages](https://www.facebook.com/help/instagram/791161338412168)
- An Instagram-specific Skill, Agent, and active Agent Connector, [connected to the uploaded bot](https://developers.liveperson.com/tutorials-guides-getting-started-with-bot-building-deploy-the-bot.html) associated with this guide
- Correct configuration of Conversational Cloud account settings in Houston (ask your account representative if you're not a LivePerson employee)
    - AC Features:
        - Messaging:AC feature Common.Async_Messaging
        - Messaging.Agent_File_Sharing (required for capabilities that involve sharing images)
        - Messaging.Agent_File_Sharing_V2 (required for capabilities that involve sharing images)
    - Site Settings:
        - Messaging.file.sharing.enabled (required for capabilities that involve sharing images)
        - Messaging.agent.file.sharing.enabled (required for capabilities that involve sharing images)
        - Messaging.rich.content.valid.urls (required for capabilities that involved sharing images) - add the connector url for the respective environment
            - VA - https://va.msg-gw.liveperson.net
            - LO - https://lo.msg-gw.liveperson.net
            - SY - https://sy.msg-gw.liveperson.net


### Setup

First, let's get Instagram integrated into the Conversational Cloud.

1. In Conversational Cloud, go to the Campaigns & Engagements section, and click 'Data Sources'.
2. On the Instagram tile, click 'Connect'
3. Click the 'Facebook Log in' button and sign in to Facebook
4. Ensure that you select the Instagram account and the connected Facebook page, and confirm the integration

You'll see the pages and will have the option to add 'Ice Breakers' (similar to engagement-controlled quick replies). 

![integrated](./readme-images/integrated.png?raw=true)

We won't touch Ice Breakers in this guide, but be aware that they're an available option.

To confirm that messages are coming into the Conversational Cloud, send a DM to the Instagram page you integrated. You should see the message, as well as information about the consumer.

![consumer](./readme-images/consumer.png?raw=true)

However, we're not currently routing folks coming to a specific skill. We want all Instagram communications to go to our Instagram skill, and we can configure this routing in Houston. If you don't have access to Houston, please contact your LivePerson representative.

We'll grab the 'Company branch' value from the 'Customer info' section of that conversation and use it for our routing. In Houston, under 'Skill Selection' add a rule similar to this:

![routing](./readme-images/routing.png?raw=true)

Now all Instagram communications will route to our Instagram bot. Once they reach the bot, we have a Dialog called 'Determine Entry Point' which analyzes if the consumer is reaching out to the brand via a Direct Message, Story Mention, or Story Reply. Then, it routes the conversation to Interactions with those same names. This is the code used:

```js
var customerInfo = botContext.getLPCustomerInfo();
var entryPoint = customerInfo.ctype;
botContext.printDebugMessage("type: " + entryPoint);
botContext.setTriggerNextMessage(entryPoint);
```

The `ctype` value will be 'Direct Message', 'Story Mention', or 'Story Reply', so the Interactions share those exact names out of convenience. Renaming them would break the flow, but they can of course be customized to provide different responses, or route the consumer to a different skill, etc.

### Example Use Case

1. An electronics e-commerce brand posts on their story asking followers to @mention the brand. The first 50 people to @mention them get a discount promo code
2. The consumer @mentions the brand in their story
3. The bot receives the message, validates that it's the consumer's first time and that they're within the first 50 people to @mention, and then serves them the promo code





