function lambda(input, callback) {
    const {
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
    // Configure the auto-reply for public tweets. This will be sent to all public tweets which match the filtered stream rule (https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction) configured in Houston.
    const myMessage = `Thanks for reaching out. Let's take this conversation to DM and our team can help get you sorted. https://twitter.com/messages/compose?recipient_id=${socialMetadata.conversationState.dmChatId}`;
    const sendTwitterPublicResponse = () => {
      if (socialMetadata && socialMetadata.channel === "Public") {
        const socialMetadataResponse = {
                      'type': 'SocialMessagingEventData',
                      'channel': channel,
                      'replyToId': socialMetadata.replyToId,
                      'event': {
                          'parent': {
                              'attachmentUrl': '',
                              'timestamp': Date.now(),
                              'accountName': 'LPAirlines', // your brand name (this is sent to the agent, not the consumer)
                              'tweetText': 'message', // Max Length 128chars (this text is sent to the agent, not the consumer)
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
        // Add social metadata to the response
        response.context.metadata.push(socialMetadataResponse);
        
        const structureContentSM = {
            type: "vertical",
            elements: [
              {
                type: 'text',
                text: myMessage,
                alt: 'sm-piggyback',
              }
            ],
        }
        // Add tweet reply text to the response
        response.context.structuredContent = structureContentSM;
      } else {
        const message = 'conversation is not public social';
        response.messages.push(message);
        console.warn(message);
      }
    }
  
    sendTwitterPublicResponse();
  
    callback(null, response);
  }