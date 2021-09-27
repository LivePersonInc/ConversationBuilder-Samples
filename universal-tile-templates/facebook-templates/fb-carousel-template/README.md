# Facebook Carousel Template

This template renders a carousel of structured card messages that include a text title, subtitle, image and three buttons that link to distinct web pages. More information on Facebook Carousel Templates can be found in our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-carousel-template.html).

> **Note**: To display this interaction, all URL domains for button links must be whitelisted on the Facebook platform. Please see [our documentation](https://developers.liveperson.com/facebook-messenger-templates-introduction.html#facebook-messenger-setup) for guidance on how to whitelist domains in Facebook.

![fb-carousel-template-1](fb_Carousel_Template1.jpg)    ![fb-carousel-template-2](fb_Carousel_Template2.jpg)

```json
{
  "type": "carousel",
  "elements": [
    {
      "type": "vertical",
      "elements": [
        {
          "type": "vertical",
          "elements": [
            {
              "type": "image",
              "url": "https://i.imgur.com/7nSKrd0.png",
              "tooltip": "image"
            },
            {
              "type": "text",
              "tag": "title",
              "text": "Greetings from LivePerson",
              "tooltip": "Title"
            },
            {
              "type": "text",
              "tag": "subtitle",
              "text": "Carousel card #1",
              "tooltip": "subtitle"
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
      "tag": "generic"
    },
    {
      "type": "vertical",
      "elements": [
        {
          "type": "vertical",
          "elements": [
            {
              "type": "image",
              "url": "https://i.imgur.com/7nSKrd0.png",
              "tooltip": "image"
            },
            {
              "type": "text",
              "tag": "title",
              "text": "Greetings from LivePerson",
              "tooltip": "Title"
            },
            {
              "type": "text",
              "tag": "subtitle",
              "text": "Carousel card #2",
              "tooltip": "subtitle"
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
      "tag": "generic"
    }
  ]
}
```
