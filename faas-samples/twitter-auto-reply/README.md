## Summary

This FaaS function can be used to automatically respond to public twitter messages from consumers mentioning your brand. In this example, a reply will be posted on the consumer's tweet advising them to DM the brand. This DM will then flow into the Conversational Cloud where it can be handled by bots or agents.

## Requirements

- A LivePerson account with access to FaaS
- A Twitter account

## Setup Instructions

1. Connect your Twitter account to LivePerson by following [this guide](https://docs.google.com/document/d/1CrMOi6exLPjXYSWVJvkvnwPNsUQaCUKsmP3OILAZTk8/edit?usp=sharing). If you don't have permission to access the document, please contact your LivePerson representative.
2. Set up a Filtered Stream rule in Houston so that only public tweets mentioning the brand will flow into the Conversational Cloud. As example rule for a brand "LPAirlines" can be seen below:

```
{
	"autoStart": true,
	"timeout": 20000,
	"rules": [
		{
			"value": "@LPAirlines",
			"tag": "brand mention"
		}
	]
}
```

If you don't have access to Houston, please contact your LivePerson representative.

3. [Create a Skill and Agent](https://developers.liveperson.com/tutorials-guides-getting-started-with-bot-building-deploy-the-bot.html) in LivePerson to handle Public Twitter messages.
4. Create a Skill Routing rule in Houston for Public Twitter messages using [this guide](https://docs.google.com/document/d/1CrMOi6exLPjXYSWVJvkvnwPNsUQaCUKsmP3OILAZTk8/edit?usp=sharing).
5. [Create a new FaaS function](https://developers.liveperson.com/liveperson-functions-getting-started.html) using the "Third Party Bots Custom Integration" event template and deploy the function.
6. [Create a new third party bot](https://developers.liveperson.com/third-party-bots-custom-integration.html), selecting your FaaS function as the custom integration.
7. Start the third party bot so its status is 'Online'
8. Replace the code in your FaaS function with the `autorespond.js` code in this repository
9. Redeploy the function.

You'll now be able to quickly, scalably respond to consumer mentions of the brand on Twitter. This workflow can drive Twitter conversations into private channels, while demonstrating the brand's consumer care publicly.


