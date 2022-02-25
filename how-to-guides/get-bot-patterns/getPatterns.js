const fs = require('fs')
const ObjectsToCsv = require('objects-to-csv')
let rawdata = fs.readFileSync('bot.json')
let bot = JSON.parse(rawdata)

let getPatterns = async () => {
    let data = []
    let interactions = bot.conversationMessage
    // loop over interactions and get dialog starter patterns
    interactions.map(interaction => {
        if (interaction.pattern) {
            let newRow = {
                interaction: interaction.name,
                patterns: interaction.pattern.toString()
            }
            data.push(newRow);
        }
    })
    // loop over interactions and get user response patterns
    interactions.map(interaction => {
        if (interaction.responseMatches[0].conditions.length > 0 &&
            interaction.responseMatches[0].conditions[0].matchType == "PATTERN" &&
            interaction.responseMatches[0].conditions[0].patternMatch.patterns.length > 0) {
            let patterns = []
            interaction.responseMatches.map(response => {
                if (response.conditions[0].matchType == "PATTERN") {
                    patterns.push(response.conditions[0].patternMatch.patterns)
                }
            })
            let newRow = {
                interaction: interaction.name,
                patterns: patterns.toString()
            } 
            data.push(newRow)
        }
    })
  
  
  const csv = new ObjectsToCsv(data)
  await csv.toDisk('./patterns.csv')
}

getPatterns()