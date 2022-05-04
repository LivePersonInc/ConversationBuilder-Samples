// dependencies
var fs = require('fs'); 
var { parse, stringify } = require('csv');
var axios = require('axios');

// static variables
var url = 'https://va.bc-nlu.liveperson.net/nlp-service-0.1/analyzeIntentsByDomain';
var fileName = 'utterances.csv';

// dynamic variables
var apiKey = '';
var domainId = '';
var organizationId = '';

var parser = parse({columns: true}, function (err, records) {
    if (err) {
        console.log(err);
    } else {
        var content = records;
        content.map((line, i) => {
            axios({
                method: 'get',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'OrganizationId': organizationId,
                    'Authorization': apiKey
                },
                params: {
                    entityDataSourceId: domainId,
                    input: line.text
                }
            }).then(response => {
                content[i].top_intent = response.data.results[0].displayName;
                content[i].confidence = response.data.results[0].status;
                if (response.data.results[0].status == 'VERY_GOOD' ||
                    response.data.results[0].status == 'GOOD') {
                        content[i].match = 'TRUE'
                    } else {
                        content[i].match = 'FALSE'
                }
            }).then(_ => {
                stringify(content, {
                    header: true
                }, function (err, output) {
                    if (err) {
                        console.log(err)
                    } else {
                        fs.writeFile(__dirname+'/results.csv', output, function(err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    }
                })
            })
        })
    }
});

fs.createReadStream(__dirname+'/'+fileName).pipe(parser);