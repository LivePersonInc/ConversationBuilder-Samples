# Image Multi Action

![image-multi-action](Image_Multi_Action.jpg)

```json
{
  "type": "image",
  "url": "https://i.imgur.com/7nSKrd0.png",
  "caption": "Click to visit LivePerson!",
  "tooltip": "Click here!",
  "click": {
    "actions": [
      {
        "type": "publishText",
        "text": "Image Clicked!"
      },
      {
        "type": "link",
        "name": "LivePerson",
        "uri": "https://www.liveperson.com"
      }
    ]
  }
}

```
