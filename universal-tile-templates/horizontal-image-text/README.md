# Horizontal Image Text

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
