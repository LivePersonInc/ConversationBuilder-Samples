# Multiple Buttons

![button-multiple](Button_Multiple.jpg)

```json
{
  "type": "vertical",
  "elements": [
    {
      "title": "Learn More",
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
      "style": {
        "color": "#FFF",
        "background-color": "#3E47A0",
        "size": "medium"
      },
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
      "style": {
        "color": "#FFF",
        "background-color": "#3E47A0",
        "size": "medium"
      },
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
```
