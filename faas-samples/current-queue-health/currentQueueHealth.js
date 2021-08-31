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