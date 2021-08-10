# Horizontal 4 Images

This tempalate renders four "shoe" images for our users, each clickable with a "publishText" action type. Clicking on any one shoe image will return the text "Sneaker" along with the number for that particular shoe.

**Note**: When using in a deployed web messaging bot, the URL `https://i.imgur.com` will need to be whitelisted to display the images.

![horizontal-4-images](Horizontal_4Images.jpg)

```json
{
  "type": "horizontal",
  "elements": [
    {
      "type": "image",
      "url": "https://i.imgur.com/drw6daj.jpg",
      "tooltip": "Sneaker 01",
      "click": {
        "actions": [
          {
            "type": "publishText",
            "text": "Sneaker 01"
          }
        ]
      }
    },
    {
      "type": "image",
      "url": "https://i.imgur.com/kjDVaLK.jpg",
      "tooltip": "Sneaker 02",
      "click": {
        "actions": [
          {
            "type": "publishText",
            "text": "Sneaker 02"
          }
        ]
      }
    },
    {
      "type": "image",
      "url": "https://i.imgur.com/6deq3RX.jpg",
      "tooltip": "Sneaker 03",
      "click": {
        "actions": [
          {
            "type": "publishText",
            "text": "Sneaker 03"
          }
        ]
      }
    },
    {
      "type": "image",
      "url": "https://i.imgur.com/iV8lWbC.jpg",
      "tooltip": "Sneaker 04",
      "click": {
        "actions": [
          {
            "type": "publishText",
            "text": "Sneaker 04"
          }
        ]
      }
    }
  ]
}

```
