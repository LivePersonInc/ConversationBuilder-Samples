# Universal Interaction Templates for Facebook

This directory contains Universal Interaction templates customized to display rich content on Facebook Messenger.

For information on creating Facebook templates, please see our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-introduction.html).

Facebook interactions are limited in capability compared to the full features that are available on other channels, such as web messaging. Some of these limitations include:

* Facebook generic and button templates are limited to displaying to 3 buttons. Additional buttons included in the template will be ignored.
* All templates require at least 2 elements in order to render (ex: a single "text" element will fail to appear). Images and buttons built with the Universal Interaction require a title element. If you want to display a single text interaction, use the default Conversation Builder text interaction.
* "Click" actions are restricted to buttons (in web messaging, click actions can also be added to images). Additionally, multi-action buttons are not compatible with Facebook buttons.
* In additional to whitelisting image URLs on the LivePerson side, both image and link URLs need to be whitelisted in Facebook's settings. See **[Facebook Messenger Setup](https://developers.liveperson.com/facebook-messenger-templates-introduction.html#facebook-messenger-setup)** for guidance on authorizing these URLs on Facebook.

For more information on rich content limitations on Facebook, see our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-limitations.html).
