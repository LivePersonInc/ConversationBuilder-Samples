# Description

This bot template provides a solution enabling consumers to return back to the previous interaction in a LivePerson bot. It includes examples of going back in three ways:

- An utterance (eg. 'back') triggers a custom rule taking the consumer back to the previous interaction
- A button click triggers a custom rule taking the consumer back to the previous interaction
- An utterance (eg. 'back') does not match with any custom rules on the interaction, but does match with the dialog starter for the 'back' dialog, taking the consumer back to the previous interaction

# Video of the Solution in Action

todo

# Implementation Instructions

All of this functionality is accomplished with two functions defined in the Global Functions of the bot, `trail` and `goBack`.

### Trail

```js
function trail (val) { 
    var ih = botContext.getBotVariable("interactionHistory"); 
    ih = ih ? JSON.parse(ih) : []; // Parse the interaction history or make a new array if it doesn't exist
    ih.push(val); 
    botContext.printDebugMessage("interaction history: " + JSON.stringify(ih)); 
    botContext.setBotVariable("interactionHistory", JSON.stringify(ih), true, false); // Stringify the interaction history and save it as a bot variable
}
```

The `trail` function takes in an interaction name (string) and updates an array of all the interactions the consumer has triggered while interacting with the bot. Then it stringifies and saves the array to the `interactionHistory` bot variable.

The trail function **must be added to the pre-process code of all interactions in the bot** in order for back functionality to work correctly.

For an interaction named 'ask_user_their_birthday', you would put the following in the pre-process code:

```js
trail('ask_user_their_birthday');
```

### GoBack

```js
function goBack () { 
    var bc = botContext.getBotVariable("interactionHistory"); 
    bc = bc ? JSON.parse(bc) : [];
    if (bc.length === 0) { 
        botContext.printDebugMessage("Cannot go back any further, end of interaction history"); 
        return; 
    } 
    var s = bc.splice(0, bc.length - 1); 
    var l = s.pop(); 
    botContext.setBotVariable("interactionHistory", JSON.stringify(s), true, false);
    botContext.printDebugMessage("Going back to: " + l); 
    botContext.setTriggerNextMessage(l); 
}
```

The `goBack` function checks the `interactionHistory` bot variable (set in the `trail` function) and takes the consumer back to the last interaction they were on.

Recommended implementation is to create a new dialog with a single text interaction.

The dialog starter can be a pattern (eg. `*back*`) or an intent. The text interaction can have a contents of `BLANK_MESSAGE` so no text is displayed to the user.

In the pre-process code for the text interaction, put:

```js
goBack();
```

