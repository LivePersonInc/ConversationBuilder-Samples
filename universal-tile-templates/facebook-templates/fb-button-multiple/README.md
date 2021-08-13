# Facebook Multiple Buttons

This template renders a title and three buttons, each with a "link" action type to direct to a distinct URL. More information on Facebook Button Templates can be found in our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-button-template.html) and [Facebook's Button Template reference](https://developers.facebook.com/docs/messenger-platform/reference/templates/button).

> **Note**: To display these buttons, all URL domains must be whitelisted on the Facebook platform. Please see [our documentation](https://developers.liveperson.com/facebook-messenger-templates-introduction.html#facebook-messenger-setup) for guidance on how to whitelist domains in Facebook.



![fb-button-multiple](fb_Button_Multiple.jpg)

```json
{
    "type": "vertical",
    "elements": [
      {
        "type": "vertical",
        "elements": [
          {
            "type": "text",
            "tooltip": "Multi-button display",
            "tag": "title",
            "text": "Multi-button display"
          },
          {
            "title": "Learn More",
            "tooltip": "Click me!",
            "type": "button",
            "click": {
              "actions": [
                {
                  "type": "link",
                  "uri": "https://www.liveperson.com",
                  "target": "blank"
                }
              ]
            }
          },
          {
            "title": "Sales & Marketing",
            "tooltip": "Click me!",
            "type": "button",
            "click": {
              "actions": [
                {
                  "type": "link",
                  "uri": "https://www.liveperson.com/solutions/sales-and-marketing",
                  "target": "blank"
                }
              ]
            }
          },
          {
            "title": "Conversation Builder",
            "tooltip": "Click me!",
            "type": "button",
            "click": {
              "actions": [
                {
                  "type": "link",
                  "uri": "https://www.liveperson.com/products/conversation-builder",
                  "target": "blank"
                }
              ]
            }
          }
        ]
      }
    ],
  "tag": "button"
}
```
