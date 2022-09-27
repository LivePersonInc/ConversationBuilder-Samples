const csv = require("csvtojson");
const ObjectsToCsv = require('objects-to-csv');

const intentsFile = './Intents.csv';
const entitiesFile = './Entities.csv';

// add the entity names which you want to replace with their values in the training phrases

const entityNames = []; // eg. "DOG_ENTITY", "CAT_ENTITY", "PERSON_ENTITY"

let intentsArray = [];
let entitiesArray = [];
let swaps = 0;

// get json data from csvs

async function getJsonData () {
    try {
        intentsArray = await csv().fromFile(intentsFile);
        entitiesArray = await csv().fromFile(entitiesFile);
    }
    catch (err) {
        console.log(err)
    }
}

// take in the entities list and the entity name and return a random value from that entity

function getRandomEntityValue (entitiesList, entityName) {
    let currentEntityValues = [];
    for (i = 0; i < entitiesList.length; i++) {
        if (entitiesList[i][entityName] == '') {
            break;
        } else {
            currentEntityValues.push(entitiesList[i][entityName])
        }
    }
    let max = currentEntityValues.length;
    let randomInt = Math.floor(Math.random() * max);
    let randomValue = currentEntityValues[randomInt];
    return randomValue;
}

// take the entity name, loop over the training phrases and replace all instances of the entity name with a random value

function replaceEntities(entityName) {
    try {
        intentsArray.forEach((row, i) => {
            let intentNames = Object.getOwnPropertyNames(row);
            let phrases = Object.values(row);
            // console.log(phrases)
            phrases.map((phrase, j) => {
                if (phrase.includes(entityName)) {
                    let randomValue = getRandomEntityValue(entitiesArray, entityName)
                    phrase = phrase.replace(entityName, randomValue)
                    swaps++;
                    let intentName = intentNames[j];
                    intentsArray[i][intentName] = phrase;
                }
            })
        })

        // create new CSV

        const csv2 = new ObjectsToCsv(intentsArray);
        csv2.toDisk('./newIntents.csv');

        }
    catch (error) {
        console.log(error);
    }
}

async function main () {
    await getJsonData();
    entityNames.forEach(entity => {
        replaceEntities(entity)
    })
    console.log(swaps)
}

main()