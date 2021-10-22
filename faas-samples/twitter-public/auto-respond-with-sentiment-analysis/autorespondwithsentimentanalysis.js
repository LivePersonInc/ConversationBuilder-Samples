function lambda(input, callback) {
  const {
    message,
    context: {
      lpEvent: {
        metadata: umsMetadata = []
      } = {}
    } = {}
  } = input.payload;
  const response = {
    context: {
      metadata: []
    },
    messages: []
  }

  const crypto = require('crypto');

  // helper functions to create JWT for google bearer token until line 121 
  // thanks "hokaccha"! https://github.com/hokaccha/node-jwt-simple/blob/master/lib/jwt.js

  /**
* support algorithm mapping
*/
var algorithmMap = {
  HS256: 'sha256',
  HS384: 'sha384',
  HS512: 'sha512',
  RS256: 'RSA-SHA256'
};

/**
 * Map algorithm to hmac or sign type, to determine which crypto function to use
 */
var typeMap = {
  HS256: 'hmac',
  HS384: 'hmac',
  HS512: 'hmac',
  RS256: 'sign'
};

var jwt = module.exports;

jwt.version = '0.5.6';

/**
* Encode jwt
*
* @param {Object} payload
* @param {String} key
* @param {String} algorithm
* @param {Object} options
* @return {String} token
* @api public
*/
jwt.encode = function jwt_encode(payload, key, algorithm, options) {
  // Check key
  if (!key) {
    throw new Error('Require key');
  }

  // Check algorithm, default is HS256
  if (!algorithm) {
    algorithm = 'HS256';
  }

  var signingMethod = algorithmMap[algorithm];
  var signingType = typeMap[algorithm];
  if (!signingMethod || !signingType) {
    throw new Error('Algorithm not supported');
  }

  // header, typ is fixed value.
  var header = { typ: 'JWT', alg: algorithm };
  if (options && options.header) {
    assignProperties(header, options.header);
  }

  // create segments, all segments should be base64 string
  var segments = [];
  segments.push(base64urlEncode(JSON.stringify(header)));
  segments.push(base64urlEncode(JSON.stringify(payload)));
  segments.push(sign(segments.join('.'), key, signingMethod, signingType));

  return segments.join('.');
};

/**
* private util functions
*/

function assignProperties(dest, source) {
  for (var attr in source) {
    if (source.hasOwnProperty(attr)) {
      dest[attr] = source[attr];
    }
  }
}

function sign(input, key, method, type) {
  var base64str;
  if(type === "hmac") {
    base64str = crypto.createHmac(method, key).update(input).digest('base64');
  }
  else if(type == "sign") {
    base64str = crypto.createSign(method).update(input).sign(key, 'base64');
  }
  else {
    throw new Error('Algorithm type not recognized');
  }

  return base64urlEscape(base64str);
}

function base64urlEncode(str) {
  return base64urlEscape(Buffer.from(str).toString('base64'));
}

function base64urlEscape(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}




  const socialMetadata = umsMetadata.find(m => m.type === 'SocialMessagingEventData');
  const channel = socialMetadata.channel || 'Private';
  const source = socialMetadata.event.source;
  
  const { Toolbelt } = require('lp-faas-toolbelt');
  // Obtain an HTTPClient Instance from the Toolbelt
  // For API Docs look @ https://www.npmjs.com/package/request-promise
  const httpClient = Toolbelt.HTTPClient();

  // Decode the Twitter Metadata to return the Tweet ID
  const getTwitterId = () => {
      try {
        const encodedMessageMetadata = message.split(',')[0].split('MsgRef:')[1];
        const buff = new Buffer.from(encodedMessageMetadata, 'base64');
        const messageMetadata = buff.toString('ascii');
        if (messageMetadata) {
          let parsedData = JSON.parse(messageMetadata)
          let id = parsedData.id;
          return id;
        }
      } catch (ex) {
        console.warn(`Did not find Twitter message: ${ex}`);
      }
    };

    // Use the Tweet ID to query the Twitter API to return a Promise with the Tweet text content

    const getTwitterText = async () => {
      let tweetId = getTwitterId();
      let URL = `https://api.twitter.com/2/tweets/${tweetId}`;
      let Auth = await getSecret("TWITTER_TOKEN");
      return new Promise (resolve => {
          httpClient(URL, {
            method: "GET", // HTTP VERB
            headers: {
            'Content-Type': 'application/json',
            'Authorization': Auth
            }, // Your Headers
            simple: false, // IF true => Status Code != 2xx & 3xx will throw
            resolveWithFullResponse: false //IF true => Includes Status Code, Headers etc.
        }).then(response => {
          let parsedResponse = JSON.parse(response);
          let twitterText = parsedResponse.data.text.toLowerCase();
          console.warn(twitterText);
          resolve(twitterText);
        })
      })
    }

    // Get secret value
    const getSecret = (secretName) => {
      return new Promise (resolve => {
        let secretClient = Toolbelt.SecretClient();
        secretClient
          .readSecret(secretName)
          .then(mySecret => {
            let token = mySecret.value;
            resolve(token);
          }).catch(err => {
            console.warn(err);
          })
      })
    }

  // get google bearer token

  // TODO: make this function smarter by caching the Bearer token and only refreshing if it's expired

  const getGoogleBearer = async () => {
      console.warn("grabbing google key from secrets");
      let secretKey = await getSecret("GOOGLE_SECRET_KEY");
      let googleEmail = "your_google_unique_email_here"; // replace this with the email in the JSON file from Google Service account
      let parsedKey = secretKey.replace(/\\n/g, "\n") //thanks 'crummy'! (https://github.com/theoephraim/node-google-spreadsheet/issues/244)
      return new Promise (resolve => {
          let algorithm = 'RS256';
          let currentTime = parseInt(Date.now() / 1000);
          let expiryTime = parseInt(Date.now() / 1000) + 20 * 60;
          let claimSet = {
              "iss": googleEmail,
              "scope": "https://www.googleapis.com/auth/cloud-language",
              "aud": "https://oauth2.googleapis.com/token",
              "exp": expiryTime,
              "iat": currentTime
          }
          let signedJWT = jwt.encode(claimSet, parsedKey, algorithm);
          httpClient({
              method: 'post',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              url: 'https://oauth2.googleapis.com/token',
              form: {
              'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
              'assertion': signedJWT
              }
          }).then(response => {
              let responseJSON = JSON.parse(response);
              let accessToken = responseJSON.access_token;
              resolve(accessToken);
          }).catch(err => {
              console.warn(err);
          })
      })
  }


  // Determine public response based on google sentiment analysis of the text
  const determineResponse = async (text) => {
    let bearerToken = await getGoogleBearer();
    return new Promise (resolve => {
        console.warn("got the secret, now querying google");
        // send the text to google for sentiment analysis
          httpClient({
              method: 'post',
              headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json; charset=utf-8'
                },
              json: true,
              url: 'https://language.googleapis.com/v1/documents:analyzeSentiment',
              body: {
                'encodingType': 'UTF8',
                'document': {
                    'type': 'PLAIN_TEXT',
                    'content': text
                }
              }
            }).then(response => {
                console.warn(response.documentSentiment.score);
                let sentiment = response.documentSentiment.score; // sentiment ranges from -1 to +1
                // simple example with slightly different response tone based on negative or positive sentiment in the Tweet. Customize as needed.
                if (sentiment < 0) {
                    consumerMessage = `We take all of our customer concerns seriously. Let's take this conversation to DM and our team can help get you sorted. https://twitter.com/messages/compose?recipient_id=${socialMetadata.conversationState.dmChatId}`;
                    agentMessage = `This customer seems upset.`;
                    sendTwitterPublicResponse(consumerMessage, agentMessage);
                    console.info("upset customer resolved");
                    resolve("upset customer");
                  } else {
                    consumerMessage = `Thanks for reaching out! Let's take this conversation to DM and our team can help get you sorted. https://twitter.com/messages/compose?recipient_id=${socialMetadata.conversationState.dmChatId}`;
                    agentMessage = `This customer seems happy.`;
                    sendTwitterPublicResponse(consumerMessage, agentMessage);
                    console.info("happy customer resolved");
                    resolve("happy customer");
                  }
            }).catch(err => {
                console.warn(err);
            })
        })
      }
  
  // Set the metadata and text response JSON to be sent back to Conversational Cloud and then Twitter
  const sendTwitterPublicResponse = (consumerMessageText, agentMessageText) => {
    if (socialMetadata && socialMetadata.channel === "Public") {
      const socialMetadataResponse = {
                    'type': 'SocialMessagingEventData',
                    'channel': channel,
                    'replyToId': socialMetadata.replyToId,
                    'event': {
                        'parent': {
                            'attachmentUrl': '',
                            'timestamp': Date.now(),
                            'accountName': 'LPAirlines',
                            'tweetText': agentMessageText, // Max Length 128chars. Consumers do not see this.
                            'tweetId': socialMetadata.replyToId,
                        },
                        'source': source,
                        'type': 'Reply', // {DirectMessage | Tweet | Reply | Retweet}, // for Quote use Retweet
                    },
                    'conversationState': {
                        'currentChannel': channel,
                        'dmChatId': socialMetadata.conversationState.dmChatId,
                    }
      };
      // Set the metadata for the response
      response.context.metadata.push(socialMetadataResponse);
      
      const structureContentSM = {
          type: "vertical",
          elements: [
            {
              type: 'text',
              text: consumerMessageText,
              alt: 'sm-piggyback',
            }
          ],
      }
      // Set the public reply text for the response
      response.context.structuredContent = structureContentSM;
    } else {
      const message = 'conversation is not public social';
      response.messages.push(message);
      console.warn(message);
    }
  }

  // Run the functions to reply to the consumer and start the conversation in Conversational Cloud

  (async function () {
    try {
      let twitterText = await getTwitterText();
      await determineResponse(twitterText);
      console.warn("sending the response back to the connector");
      callback(null, response);
    } catch (err) {
      console.warn(err)
    }
  })();
}