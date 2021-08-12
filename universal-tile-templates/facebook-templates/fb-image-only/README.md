# Facebook Image Only

This template renders a generic image interaction which contains an image along with a title. More information on Facebook Generic Templates can be found in our [developer documentation](https://developers.liveperson.com/facebook-messenger-templates-generic-template.html).

> **Note**: To display this interaction, all URL domains for images must be whitelisted on the Facebook platform. Please see [our documentation](https://developers.liveperson.com/facebook-messenger-templates-introduction.html#facebook-messenger-setup) for guidance on how to whitelist domains in Facebook.

![fb-image-only](fb_Image_Only.jpg)

```json
{
    "type": "vertical",
    "elements": [
      {
        "type": "vertical",
        "elements": [
                  {
            "type": "text",
            "tooltip": "",
            "tag": "title",
            "text": "Greetings from LivePerson"
          },
          {
            "type": "image",
            "url": "https://i.imgur.com/7nSKrd0.png"
          }
        ]
      }
    ],
    "tag": "generic"
  }
  
```
