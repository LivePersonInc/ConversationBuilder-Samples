# Bulk Test a LivePerson NLU Domain

While the [Model Tester](https://developers.liveperson.com/intent-manager-build-test-with-the-model-tester.html) and [Build Tab of Intent Manager](https://developers.liveperson.com/intent-manager-build-test-a-single-utterance.html) are useful tools when testing NLU performance, sometimes it can be nice to have programmatic access for testing a domain. This Node.js script accepts a CSV file of utterances, tests them against a specific LivePerson NLU domain via API, and creates a CSV file showing for each utterance the top-matched intent, confidence level, and if there was a match or not.

![results](./readme-images/results.png?raw=true)

# Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your machine
- A trained, activated [LivePerson NLU domain](https://developers.liveperson.com/intent-manager-natural-language-understanding-liveperson-nlu-engine.html)
- A CSV file of utterances you want to test against the NLU domain. This file must be in the same format as the example in this repo (as shown below):
![utterances](./readme-images/utterances.png?raw=true)
- Basic familiarity with the command line

# Instructions

1. Create a folder on your machine to house this solution
2. Put the `index.js` file and the CSV file with the utterances into that folder
3. Rename the CSV file to `utterances.csv`
4. From the command line, while in the folder, enter `npm init` and then `npm install axios csv` to install the two dependencies ([axios](https://www.npmjs.com/package/axios) & [csv](https://www.npmjs.com/package/csv))
5. Open the `index.js` file in a text editor of your choice and update the three dynamic variables on lines 11-13
- `apiKey` can be found by going into the Conversation Builder bot list, clicking the book icon in the top right corner and selecting 'API Key'. The API Access Key will be listed here.
- `domainId` can be found by going into Intent Manager, selecting the desired domain, and clicking 'Domain Settings'. The Domain ID is listed in the basic settings.
- `organizationId` is a back-end value which can only be obtained from a LivePerson employee. Please contact your LivePerson representative to get this value.
6. From the command line, while in the folder, enter `node index.js` to run the script
7. The `results.csv` file will be generated and can be reviewed in Excel or Google Sheets