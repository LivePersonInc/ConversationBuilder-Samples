# Bot Description

This bot queries the user for a historical figure or fictional character, and then uses GPT-3 to generate language, facilitating a conversation with the user. It contains boilerplate code and an integration to get a Conversation Builder bot connected to the GPT-3 API easily.

# Requirements

- A [GPT-3 developer key](https://beta.openai.com/)
- A conversational cloud account

# Getting Started Steps

1. Import the "GPT3 Character Template" bot from this repo into your Conversational Cloud account
2. In the bot's "GPT3" integration, add a Credential for GPT-3. This should be an "Access Token" type credential. The access token will be the one GPT-3 developer key provided by OpenAI, and the token type should be "Bearer"
3. Save the integration settings
4. Test the bot in the Previewer by following the "01 Welcome" dialog flow

# Open Issues

- Ideally, the bot would use line breaks ("\n") as part of the prompt to let GPT-3 know to interpret the prompt as a conversation between two people. However, I've run into issues with this resulting in 415 errors from the GPT-3 API. This seems to only occur when hitting the API from CB, and could be due to how we send our post body in the integration. If you figure out how to correctly escape the line break in the prompt, please open a pull request.


