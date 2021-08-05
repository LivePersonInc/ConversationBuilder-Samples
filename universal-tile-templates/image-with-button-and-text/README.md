# Image With Button And Text

![image-with-button-and-text](Image_With_Button_and_Text.jpg)

```json
{
  "type": "vertical",
  "tag": "generic",
  "elements": [
    {
      "type": "vertical",
      "elements": [
        {
          "type": "image",
          "url": "https://i.imgur.com/7nSKrd0.png"
        },
        {
          "type": "button",
          "style": {
            "bold": true,
            "color": "#FFF",
            "background-color": "#3E47A0",
            "size": "medium"
          },
          "title": "Learn More",
          "click": {
            "actions": [
              {
                "type": "link",
                "uri": "https://www.liveperson.com"
              }
            ],
            "metadata": []
          }
        },
        {
          "type": "text",
          "tag": "title",
          "text": "Our AI-powered Conversational Cloud has made over a billion brand-to-consumer conversations possible. We make it easy for consumers to ask questions and make purchases in the messaging channels they use every day."
        }
      ]
    }
  ]
}

```
