# Current Queue Health Cache

The purpose of this function is to access data from the Current Queue Health API and store that data within the Conversation Context Service. Reporting APIs such as Current Queue Health are not intended for use at a conversational scale. As opposed to accessing the APIs directly from a Conversation Builder bot, this function will cache the data from this API. That data can then be accessed for routing and messaging decisions using bot context methods to access the Conversation Context Service.

This process was originally documented on our [developers forum](https://talkyard.livepersonai.com/-18/caching-current-queue-health-apis-w-faas-the-context-session-store).

---

LivePerson provides a number of APIs which are designed to be used with Reporting Dashboards to inform on items such as the status of the queue and the shift status of agents. Having this information readily accessible within Conversation Builder can assist with correctly setting expectations or properly routing individuals when a skill may not be available to escalate to. Unfortunately, many of these reporting dashboard APIs are not intended for use at a Conversational Scale, and doing so could be detrimental to the stability of our platform.

This guide is intended to provide an alternative to calling these APIs at every conversation. By using several Conversational Cloud services in conjunction with one another to regularly cache needed data, we can make this information accessible in a more robust service that is properly scaled to handle the volume of calls from each conversation.

## Prerequisites
This guide assumes that you have access to the following:
* Conversation Builder
* Conversation Orchestrator
* FaaS
* An API client, such as [Postman](https://www.postman.com/)

## Overview
This guide will cover the following steps to provide access to data from the [Messaging Current Queue Health API](https://developers.liveperson.com/messaging-operations-api-methods-messaging-current-queue-health.html):

1. Create a new namespace in the Conversation Context Service to serve as our cache.
2. Create a `currentQueueHealth` FaaS function to call the API and send the results to the newly created Context Service namespace.
3. Schedule invocation of our function to run every 5 minutes, to continually update the store.
4. Create the Conversation Builder integration to pull in the cached data.

## Obtain your Conversation Orchestrator Developer Key

The [Context Session Store](https://developers.liveperson.com/conversation-orchestrator-conversation-context-service-overview.html) within Conversation Orchestrator allows brands to store, retrieve, and manage custom attributes that can be used within a variety of Conversational Cloud services.

1. Navigate to **Conversation Orchestrator** using the grid menu in the lower left of Conversational Cloud.
2. Click *Developer Key* at the bottom of the left-hand menu and copy your API key. This will be used in all of our calls to the Context Service.

## Create and schedule a FaaS function

1. Navigate to **Functions** using the grid menu in the lower left of Conversational Cloud.
2. Save your Conversation Orchestrator API key to your Secret Storage.
   1. Click the setting icon at the bottom of the left-hand menu.
   2. Click on the *Secret Storage* menu
   3. Click the *Add a secret* button
   4. Create a new secret with the following:
      * **Key**: `mavenApiKey`
      * **Type**: `String`
      * **Value**: Your Conversation Orchestrator API key
  
3. Navigate to the *Functions* tab on the left and select the *Create a Function* button.
4. Complete the *Coding Details* section with the following:
   * **Event**: No Event
   * **Template**: Greeting Template
   * **Access to external domains?**: Yes: On the following screen, add `*.context.liveperson.net` to ensure the context service URL is accessible from the function. Alternatively, the domain can be whitelisted from the FaaS settings page.

	Click *Continue*

5. Complete the *Function Description* section with the following:
   * **Function Name**: currentQueueHealth
   * **Description**: Retrieve current queue info on scheduled intervals and update a namespace in Conversation Context Service.

	Click *Create Function*

6. In the resulting code editor screen, replace the existing code with the following code. Make sure to update the variable values for `accountId`, `namespace`, and optionally, `sessionId`.

```js
function lambda(input, callback) {
  // Importing the FaaS Toolbelt
  const { Toolbelt } = require("lp-faas-toolbelt");
  // Obtain an lpClient Instance from the Toolbelt
  const lpClient = Toolbelt.LpClient();
  // Obtain a secretClient instance from the Toolbelt to access your saved Conversation Orchestrator key
  const secretClient = Toolbelt.SecretClient();
  
  // Variables to access Current Queue Health API
  const accountId = ''; //complete w/ site id
  const lpServiceName = 'leDataReporting';
  const apiEndpoint = `/operations/api/account/${accountId}/msgqueuehealth/current/?v=1`;
  const apiOptions = {
    method: 'GET',
    json: true
  }

  // Variables for Conversation Context Service
  const namespace = ''; // name of the namespace
  const sessionId = '' || undefined; // optional: if not provided will use default session


  // Retrieve mavenApiKey from secret storage to authorize POST to Conversation Context Service
  async function fetchSecret() {
    try {
      const secret = await secretClient.readSecret('mavenApiKey');
      return secret.value;  
    } catch(err) {
      console.error('Could not retrieve api key from secret storage');
    } 
  }

  // Update conversation context service with results from the current queue health call
  async function updateConversationContextService(keyValuePair, secret) {
    const contextClient = Toolbelt.ContextServiceClient({ apiKey: secret, accountId: accountId });
    try {
      const sessionProperties = await contextClient.updatePropertiesInNamespace(namespace, keyValuePair, sessionId);
      console.info(sessionProperties);
      callback(null, `Successfully updated Context Service`);
    } catch(err) {
      console.error('Could not update properties in the context service');
    }
  }
    
  // Call the Current Queue Health API, retrieve the api key from secret storage, and update Conversation Context Service.
  async function main() {
    const queueHealthResponse = await lpClient(lpServiceName, apiEndpoint, apiOptions);
    const secret = await fetchSecret();
    updateConversationContextService(queueHealthResponse, secret);
  }

  main();
}
```

> Using the Secret Storage, Context Service, and LP Clients from the `lp-faas-toolbelt` package, this function calls the current queue health API and passes that to a function to call and update the Conversation Context Service.

7. After saving, deploy the function using the three-dot menu at the end of the function's row. Once deployed, invoke the function to test and ensure that it is working. If successful, the logs should read `Successfully updated Context Service`.
8. Verify using Postman that the namespace and session have been updated in the Context Service. To test, provide the following details to your API client:
   * **Method**: `GET`
   * **URL**: `https://{baseUrl}/v1/account/{accountNumber}/{namespace}/properties`
      * Replace `{baseUrl}` with the correct URL for your environment, found [here](https://developers.liveperson.com/conversation-orchestrator-conversation-context-service-methods.html#rest-apis-overview).
   	 * Replace `{accountNumber}` with your Conversational Cloud account number. 
     * Replace `{namespace}` with the same namespace value you created in the FaaS function above

	* **Headers**: 
		```
		Content-Type: application/json

		maven-api-key: {mavenApiKey}
		```

    	* Replace `{mavenApiKey}` with your copied developer key from Conversation Orchestrator

    If successful, the call to the Context Service will display the results of the Messaging Current Queue Health API.

9. Schedule the FaaS invocation by selecting the *Schedules* tab from the left-hand menu. Tap the *Create a schedule* button and select the newly deployed function from the resulting dropdown.
10. Schedule the function invocation and whichever interval fits the use case for your brand. For this example, entering `/5` in the *Minutes* field will result in this function running and updating the Context Service every 5 minutes.

With the function scheduled, we now have a session within our Context Service being updated with a reasonable approximation of the current queue health, including information on the estimated wait time. 

## Access the Context Service data using Conversation Builder

We can now responsibly query for data from the Context Service for use within Conversation Builder. The following example demonstrates using [Context Session Store methods](https://developers.liveperson.com/conversation-builder-scripting-functions-manage-the-context-session-store.html) to retrieve and display the relevant information.

1. Ensure you have access to the Context API 
   * From the Conversational AI menu of the Conversational Cloud, navigate into *Bot Accounts* and select your account
   * In *Account Details*, toggle the *Enable Context API* switch to *on* 
   * Select the *Use Conversational Cloud Site ID* option and enter your account number

> Note: If you do not have access to this tool or process, contact your LivePerson account representative. Alternatively, Context Service data can be accessed via API integration, however, make sure to follow best practices in safeguarding secrets and API keys by taking advantage of environment variables.
  
2. Navigate to your bot in Conversation Builder. You will now have access to Context Session Store methods in Global Functions, as well as Pre/Post process code editors for each interaction.
3. Test out your ability to access this data by creating a new text interaction with the following pre-process code included:
**Note** in the `botContext.getGlobalContextData` method below, replace `messaging-operations-api` with the namespace value from your FaaS function

   ```js
    var e = botContext.getGlobalContextData('messaging-operations-api', 'skillsMetrics');
    var skillId = botContext.getBotVariable('skillId');
    var awt = e[skillId].avgWaitTimeForAgentAssignment_AfterTransferFromAgent;
    botContext.setBotVariable('awt', awt, true, false);
   ```

  This code queries the Context Service for the messaging operations api data and retrieves the average wait time for the skill in question. This information can be useful in setting expectations for your users prior to escalation. 

> Note: The screenshot above displays the call in a demo environment. ‘-1’ is the default value if there is no relevant data being returned, and as this is a demo deployment, there currently isn’t a wait time. However, by returning the -1 value, we can see that we are accessing the correct field in our data.

## Conclusion

We are now able to responsibly use the data from our reporting dashboard API to make decisions in our bot automations. While the specific use case may vary based on the needs of your brand, the steps outlined in this guide provide a foundation to query this data and make appropriate routing and expectation-setting decisions for your users.
