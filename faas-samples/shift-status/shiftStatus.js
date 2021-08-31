function lambda(input, callback) {
  // Importing the FaaS Toolbelt
  const { Toolbelt } = require("lp-faas-toolbelt");
  // Obtain an HTTPClient Instance from the Toolbelt
  const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise
  // Obtain a secretClient instance from the Toolbelt to access your saved Conversation Orchestrator key
  const secretClient = Toolbelt.SecretClient();
  //  set your account number here
  const accountId = '';

  // The domain & URL to access each resource is environment-specific according to your account number. Use https://developers.liveperson.com/api-guidelines-domain-api.html and enter your account number to retrieve the domain for the referenced resource for each variable

  const loginDomain = ''; //resource: 'agentVep'
  const shiftStatusDomain = ''; //resource: 'asyncMessagingEnt'

  const loginURL = `https://${loginDomain}/api/account/${accountId}/login?v=1.3`;
  const shiftStatusURL = `https://${shiftStatusDomain}/api/account/${accountId}/shift-status`;

  // Variables for Conversation Context Service
  const namespace = ''; // name of the namespace
  const sessionId = '' || undefined; // optional: if not provided will use default session

  // retrieve secrets from secret store
  async function fetchSecret(key) {
    try {
      const secret = await secretClient.readSecret(key);
      return secret.value;
    } catch(err) {
      console.error('err: ' + err);
    }
  }

  // log bot user in to obtain bearer token and pass to shiftStatusByAccount function
  async function loginBotUser(loginCredentials) {
    try {
      const response = await httpClient(loginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        simple: false,
        json: true,
        resolveWithFullResponse: false,
        body: loginCredentials
      })
      return response.bearer;
    } catch(err) {
      callback(err);
    }
  }

  // use bearer token to access shift status by account api, format the data, and pass to updateContextWarehouse function
  async function shiftStatusByAccount(token) {
    try {
      const response = await httpClient(shiftStatusURL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        simple: false,
        json: true,
        resolveWithFullResponse: false
      })
      return formatShiftStatusData(response);
    } catch(err) {
      callback(err);
    }
  }

  // update global context of context session store at shift-status-api namespace
  async function updateConversationContextService(keyValuePair, secret) {
    const contextClient = Toolbelt.ContextServiceClient({ apiKey: secret, accountId: accountId });
    try {
      const sessionProperties = await contextClient.updatePropertiesInNamespace(namespace, keyValuePair, sessionId);
      console.info(sessionProperties);
      callback(null, `Successfully updated Context Service`);
    } catch(err) {
      callback(err);
    }
  }

  // Format the result to add a timestamp as well as use skill id as key in global context store to make accessing skill id information easier.
  function formatShiftStatusData(shiftStatusData) {
    const currentTime = new Date();
    const formattedData= {timestamp: currentTime};

    shiftStatusData.forEach(skill => {
      const dataObj = skill;
      formattedData[skill.skillId] = dataObj;
    })

    return formattedData;
  }

  async function main() {
    // Retrieve from Secret Storage
    const loginCredentials = await fetchSecret('loginCredentials');
    const mavenApiKey = await fetchSecret('mavenApiKey');
    // Retrieve Bearer Token
    const bearerToken = await loginBotUser(loginCredentials);
    // Retrieve Shift status data
    const shiftStatusData = await shiftStatusByAccount(bearerToken);
    // Update CCS
    updateConversationContextService(shiftStatusData, mavenApiKey);
  }

  main()
}