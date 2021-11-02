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

    // Determine public response based on tweet content
    const determineResponse = (text) => {
      let consumerMessage = "hello friend!";
      let agentMessage = "hello agent!"
      // example rule which is very simple
      if (text.includes("angry")) {
          consumerMessage = `Sorry to hear that you're angry. Let's take this conversation to DM and our team can help get you sorted. https://twitter.com/messages/compose?recipient_id=${socialMetadata.conversationState.dmChatId}`;
          agentMessage = `This customer seems quite upset. Please feel free to use a discount code.`;
        } else {
          consumerMessage = `Let's take this conversation to DM and our team can help get you sorted. https://twitter.com/messages/compose?recipient_id=${socialMetadata.conversationState.dmChatId}`;
          agentMessage = `This customer seems fine. Proceed as usual.`
        }
        sendTwitterPublicResponse(consumerMessage, agentMessage);
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
                              'tweetText': agentMessageText, // Max Length 128chars
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
        callback(null, response);
      } catch (err) {
        console.warn(err)
      }
    })();
  }