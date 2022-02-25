# Shopify Bots on LivePerson

This guide will provide some instructions, bot template, and code to do the following:
1. Display carousels of Shopify store items in a Web Messaging bot
2. Allow users to browse items, store selected items in memory, and then check out via custom link to the normal Shopify store checkout page

Our architecture for achieving this is:
- A FaaS function (running at a set interval) to get up-to-date information for the Shopify store items and then store that information in the Conversational Context Service
- The Universal Tile interaction to display custom, dynamic carousels
- Bot variables to store cart information and present dynamic URLs for the checkout page

https://user-images.githubusercontent.com/25466659/155249925-355c6ddd-f2ce-4f97-9b28-b0f62c883c73.mov

# Prerequisites

- A published Shopify store with an admin-created [Custom App](https://help.shopify.com/en/manual/apps/app-types#custom-apps)
- Items in the Shopify store with variants and images which correspond to those variants
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

This is a more advanced example of a Universal Tile pre-process code which can filter down the Shopify product list as the user desired. In production, you would have filters (bot variables) based on user profile or questions asked by the bot and filter the displayed products accordingly.

# Instructions

1. Create a custom app for your Shopify store and get the authorization token or URL
2. Update the `Shopify2ContextService.js` FaaS function with your Shopify/account information, deploy it, and run it. Ensure that you whitelist `*.context.liveperson.net` and `*.myshopify.com`. Go [here](https://developers.liveperson.com/function-as-a-service-developing-with-faas-whitelisting-domains.html) for more information on whitelisting.
3. Import the `ShopifyBot.json` file as a new CB bot in your account
4. In the bot, update the integration URL with your account's account number and add your `maven-api-key` value
5. In the bot's global function, update the `storeURL` variable to the URL for your store (eg. `https://mystorename.myshopify.com`)
6. If you have access to Houston, whitelist `https://cdn.shopify.com`. Otherwise, contact your LivePerson representative.
7. Test the bot in the Previewer or in a Web Engagement. Try adding multiple items and then checking out.

# Notes

- It's difficult to control the size of the carousel tiles, so having product images that are the same size is useful
- Maximum carousel size is 9
- Pagination would be necessary for a large store, but is outside the scope of this guide. Pull requests are welcomed!
- Use of Entities/Slots is also outside the scope of this guide, but it would be nice to have a template for something like "Show me black shoes", where `black` and `shoes` are entities. Pull requests are welcomed!
