var buttonCount = botContext.getBotVariable('buttonCount');
var allButtons = JSON.parse(botContext.getBotVariable('allButtons'));
var cardElements = [
  {
    "type": "text",
    "text": "You've selected " + buttonCount + " button(s)",
    "tooltip": buttonCount + " button(s)"
  }
];
for (var i = 0; i < allButtons.length; i++) {
  var element = {
    "type": "button",
    "title": allButtons[i].label,
    "click": {
      "actions": [
        {
          "type": "publishText",
          "text": allButtons[i].payload
        }
      ]
    },
    "tooltip": allButtons[i].label
  };
  cardElements.push(element);
}
cardElements.push({
  "type": "text",
  "text": "Select a button to proceed",
  "tooltip": "Click a button!"
});
var json = {
  "type": "vertical",
  "elements": cardElements
};

botContext.setBotVariable('jsonTemplate', JSON.stringify(json), true, false);