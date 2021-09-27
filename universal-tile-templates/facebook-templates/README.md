# Universal Interaction Templates for Facebook

This directory contains Universal Interaction templates customized to display rich content on Facebook Messenger.

For more information on creating Facebook templates, please see our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-introduction.html) and [Facebook's message templates documentation](https://developers.facebook.com/docs/messenger-platform/send-messages/templates).

Facebook interactions are limited in capability compared to the full features that are available on other channels, such as web messaging. Some of these limitations include:

* Facebook generic and button templates are limited to displaying a maximum of 3 buttons. Including additional buttons will result in an error in displaying the interaction to users.
* All templates require at least 2 elements in order to render (ex: a single "text" element will fail to appear). Images and buttons built with the Universal Interaction require a title element. If you want to display a single text interaction, use the default Conversation Builder text interaction.
* "Click" actions are restricted to buttons (in web messaging, click actions can also be added to images). Additionally, multi-action buttons are not compatible with Facebook buttons.
* To display interactions which include button links, all linked URL domains must be whitelisted on the Facebook platform. Please see [our documentation](https://developers.liveperson.com/facebook-messenger-templates-introduction.html#facebook-messenger-setup) for guidance on how to whitelist domains in Facebook.

For more information on rich content limitations on Facebook, see our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-limitations.html).
