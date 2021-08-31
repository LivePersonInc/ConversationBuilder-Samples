# VIP check
- This no-event function is used in Conversational Orchestrator to check whether a consumer is a VIP, and route accordingly
- In the bot, we ask them to provide their customer ID number, write that to the context store, and then use the Dynamic Routing Tile
- In Conversational Orchestrator, we'll have a Custom Function attribute (for this function) and a Policy which uses that attribute
- We're storing our API key as a secret (https://developers.liveperson.com/liveperson-functions-developing-with-faas-storing-secrets.html) and grabbing it using the Toolbelt.SecretClient() method