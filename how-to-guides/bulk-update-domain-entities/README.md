# Bulk Update a LivePerson NLU CSV File to Replace Entity Names with Entity Values

When entity names are added to training phrases (eg. "I would like to speak with a PERSON_ENTITY" where a PERSON_ENTITY exists with values like "human", "person", "rep", etc.) they are expanded at training time. So that example sentence would exist three times in the trained model—one for each entity value. This can be an issue if an intent has a large number of training phrases with entity names, and these entities have large numbers of value. Our NLU has a maximum of 100 expansions per intent, which can cause some training phrases to be overweighted, and others excluded from the model.

This script takes an exported LivePerson NLU CSV file and replaces specified entity names with a random entity value from that entity. The resulting domain will not have this training phrase expansion issue, and every phrase will be included in the trained model.

**Before running the script:**

![before](./readme-images/Entity_Names.png?raw=true)

**After running the script:**

![after](./readme-images/Entity_Values.png?raw=true)

# Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your machine
- A  [LivePerson NLU domain](https://developers.liveperson.com/intent-manager-natural-language-understanding-liveperson-nlu-engine.html) with entity names in its training phrases
- Basic familiarity with the command line

# Instructions

1. Create a folder on your machine to house this solution
2. [Export the NLU domain CSV files](https://developers.liveperson.com/intent-manager-build-domains.html#download-a-domain) from LivePerson
2. Put the `index.js` file and the CSV files into that folder
3. Rename the CSV files to `Intents.csv` and `Entities.csv`
4. From the command line, while in the folder, enter `npm init` and then `npm install csvtojson objects-to-csv` to install the two dependencies ([CSV to JSON](https://www.npmjs.com/package/csvtojson) & [Objects to CSV](https://www.npmjs.com/package/objects-to-csv))
5. Open the `index.js` file in a text editor of your choice and on Line 9, update the `entityNames` variable to add the entity names you want to replace with their values in the training phrases
6. From the command line, while in the folder, enter `node index.js` to run the script
7. The `newIntents.csv` file will be generated and can be reviewed in Excel or Google Sheets before being [uploaded back to the domain in LivePerson](https://developers.liveperson.com/intent-manager-build-domains.html#add-a-domain-manually-or-using-an-import-file)