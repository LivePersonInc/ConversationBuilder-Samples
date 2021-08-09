# Image With URL

This template renders a single image along with a caption, "Greatings from LivePerson". Clicking on the button triggers a "link" action which navigates the user to [https://www.liveperson.com](https://www.liveperson.com).

**Note**: When using in a deployed web messaging bot, the URL `https://i.imgur.com` will need to be whitelisted to display the image.

![image-with-url](Image_With_URL.jpg)

```json
{
  "type": "image",
  "url": "https://i.imgur.com/7nSKrd0.png",
  "caption": "Click to visit LivePerson!",
  "tooltip": "Click here!",
  "click": {
    "actions": [
      {
        "type": "link",
        "name": "LivePerson",
        "uri": "https://www.liveperson.com"
      }
    ]
  }
}

```
