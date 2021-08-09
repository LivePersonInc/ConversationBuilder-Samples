# Horizontal Image Text

This tempalate renders a horizontally formatted image and text card. Clicking on the image triggers a "link" action which navigates the user to [https://www.liveperson.com](https://www.liveperson.com).

**Note**: When using in a deployed web messaging bot, the URL `https://i.imgur.com` will need to be whitelisted to display the image.

![horizontal-image-text](Horizontal_Image_Text.jpg)

```json
{
  "type": "horizontal",
  "elements": [
    {
      "type": "image",
      "url": "https://i.imgur.com/PqUKsWS.png",
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
      "type": "text",
      "text": "Thank you for using LivePerson's Conversational Cloud",
      "tooltip": "Thanks!",
      "style": {
        "bold": true,
        "size": "small",
        "color": "#0F0943",
        "background-color": "#FFF"
      }
    }
  ]
}

```
