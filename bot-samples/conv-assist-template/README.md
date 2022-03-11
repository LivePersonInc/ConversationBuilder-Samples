This bot provides a plug-and-play example of a bot designed to be used by Conversational Assist. The bot assists consumers with ordering a replacement credit or debit card. It can also optionally put a hold on their old card and update their address so as to send the new card to the correct place. The bot follows best practices for bots used in Conversational Assist, such as:

- Custom events logging invocations as well as success/fail flow completions
- Custom rules to keep the conversation on rails for the specific flow
- Ability for the bot to close the conversation if the flow is completed and the consumer has no further questions
- The bot will cease to respond (allowing time for the agent to return to the conversation) if the consumer does have further questions

# Requirements

- A LivePerson Conversational Cloud account
- An active domain [using the "Finance" prebuilt domain](https://developers.liveperson.com/intent-manager-key-terms-concepts.html#prebuilt-domains)
- A campaign, skill and user agent so as to conduct test conversations in web messaging
- A bot agent to be used as the agent connector in the bot
- Access to [Conversation Assist](https://developers.liveperson.com/tutorials-guides-using-conversation-assist-configure-conversation-assist.html) in LivePerson Conversational Cloud

# Instructions

1. [Import the ReplacementCardHelper.json file](https://developers.liveperson.com/conversation-builder-bots-bot-basics.html#import-a-bot) into your account.
2. Verify that `ask about replacement card` is the assigned intent in the `replace card starter` interaction. If it isn't, then manually assign it.
3. Select your bot agent as the agent connector for the bot.
4. Go into the Conversation Assist settings and turn on the `ReplacementCardHelper` bot as a recommendation source for the skill associated with your test campaign.
5. Use the [Web Messaging emulator](https://developers.liveperson.com/web-messaging/emulator.html) to conduct a test chat with yourself. Have the consumer ask something like "I need a new card" which will trigger the Conversation Assist suggestion to the agent.
6. As the agent, click the suggestion to delegate the conversation to the bot.
7. As the consumer, go through the conversational flow.
8. Once the conversation is completed, go into Bot Analytics -> Custom Events to see the logging for the conversation.