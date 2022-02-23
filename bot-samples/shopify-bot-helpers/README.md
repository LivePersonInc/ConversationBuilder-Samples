# Shopify Bots on LivePerson

This guide will provide some guidance and code to do the following:
1. Display carousels of Shopify store items in a Web Messaging bot
2. Allow users to browse items, store those items in a virtual 'cart', and then 'check out' via a custom link to the Shopify store checkout page going to those items

Our architecture for achieving this is:
- A FaaS function (running at a set interval) to get up-to-date information for the Shopify store items and then store that information in the Conversational Context Service
- The Universal Tile interaction to display custom, dynamic carousels
- Bot variables to store cart information and present dynamic URLs for the checkout page

# Prerequisites

- A Shopify store with a [Custom App](https://help.shopify.com/en/manual/apps/app-types#custom-apps) so you can get the store items
- A LivePerson CB Bot
- Access to FaaS and the Conversation Context Service in LivePerson
- Basic JavaScript knowledge

# Contents

#### Shopify2ContextService.js

This FaaS function should be pretty plug and play (once you enter in your desired Shopify URL, LivePerson account details, and context service namespace).

Run it and then set it to run at a set interval (daily, hourly, etc.)

#### ShopifyBot.json

This bot file contains a CB bot with a minimal Shopify experience (browse item carousel, check out). It should be fairly plug and play (once you update the integration to access the namespace used in the FaaS function). You can then extend it as you need.

#### FilteredCarousel.js

This is an more advanced example of a Universal Tile pre-process code which can filter down the Shopify product list as the user desired. In production, you would have filters (bot variables) based on user profile or questions asked by the bot and filter the displayed products accordingly.

# Instructions

1. Create a custom app for your Shopify store and get the authorization token or URL
2. Update the 1Shopify2ContextService.js` FaaS function with your Shopify/account information, deploy it, and run it. Ensure that you whitelist `*.context.liveperson.net` and `*.myshopify.com`
3. Import the `ShopifyBot.json` file as a new CB bot in your account
4. In the bot, update the integration URL with your account's account number and add your `maven-api-key` value
5. In the bot's global function, update the `storeURL` variable to the URL for your store (eg. `https://mystorename.myshopify.com`)
5. If you have access to Houston, whitelist `https://cdn.shopify.com`. Otherwise, contact your LivePerson representative.
6. Test the bot in the Previewer or in a Web Engagement. Try adding multiple items and then checking out.

# Notes

- It's difficult to control the size of the carousel tiles, so having product images that are the same size is useful
- Maximum carousel size is 9
- Pagination would be necessary for a large store, but is outside the scope of this guide. Pull requests are welcomed!
- Use of Entities/Slots is also outside the scope of this guide, but it would be nice to have a template for something like "Show me black shoes", where `black` and `shoes` are entities. Pull requests are welcomed!