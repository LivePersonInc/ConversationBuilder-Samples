# Button With Message

![button-with-message](Button_With_Message.jpg)

```json
{
  "title": "Button with Message",
  "tooltip": "Click me!",
  "type": "button",
  "style": {
    "color": "#FFF",
    "background-color": "#3E47A0",
    "size": "medium"
  },
  "click": {
    "actions": [
      {
        "type": "publishText",
        "text": "Button Clicked!"
      }
    ]
  }
}

```
