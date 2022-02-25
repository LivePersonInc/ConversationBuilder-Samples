# Get Patterns from a CB Bot

It can be difficult to track down all the patterns used in a bot (either as dialog starters or as mid-flow user response rules). This Node.js script takes an exported CB bot JSON file and generates a CSV file showing all the patterns and which interaction they belong to.

![patterns-sheet](./readme-images/patterns-sheet.png?raw=true)

# Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your machine
- The [exported JSON file](https://developers.liveperson.com/conversation-builder-bots-bot-basics.html#export-a-bot) for the bot you want to get the patterns from
- Basic familiarity with the command line

# Instructions

1. Create a folder on your machine to house this solution
2. Put the `getPatterns.js` file and the exported bot JSON file into that folder
3. Rename the bot JSON file to `bot.json`
4. From the command line, while in the folder, enter `npm init` and then `npm install` to install the dependency ([objects-to-csv](https://www.npmjs.com/package/objects-to-csv))
5. From the command line, while in the folder, enter `node getPatterns.js` to run the script
6. The `patterns.csv` file will be generated and can be reviewed in Excel or Google Sheets