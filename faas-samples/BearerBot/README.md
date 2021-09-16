# Bearer Token Bot

This function provides a single bearer token which can be used across mutliple functions to authenticate Conversational Cloud API calls.

There are several Conversational Cloud APIs which require a bearer token to authenicate. Use cases such as 'Operational Data Caching', and 'Shift Status' are prime examples.
In order to retreive a Bearer Token, a Login must be performed via the Login Service in exchange for a bearer token.
It may be acceptable to perform this for certain functions which run periodcally with low frequency, however, for more high volume use cases - or where you have multiple functions which require a token, this solution makes it significantly easier to manage by exposing a single bearer token which can be leveraged across multiple functions. 

The function provides the bearer token in the form of a `secretStorage` object, which the function updates periodically.


Documented relating to out Application Login API can be found on our [developers site](https://developers.liveperson.com/login-service-api-methods-application-login.html).

---
# Function Preparation
This solution utilises a 'Bot' Type Conversational Cloud user, which logins to the platform with an API key, wo we'll need to make an API Key first, and then the Bot User.

## Creating the Conversational Cloud API Key
1. Within CC, navigate to *API keys* `(campaigns -> data -> API keys)`
2. Create a new API Key, name it 'FAAS-RUNNER'
   The API key should have the following permissions enabled:
   * login
   * Conversation History / Messaging Interactions 
3. Make a note of the API key credentials (App key, Secret, Access Token, Access Token Secret) as we will need these in subequent steps

## Creating the Conversational Cloud user
1. Navigate to '*USERS*' 
2. Create a new Conversational Cloud user account with the following values:
    - **login name**: 'FAAS-RUNNER' (use the same for fullName, nickName)
    - **Roles**: Administrator and Agent Manager
    - **Manager of**: "Main Group" (or top level agent group)
    - **email address**: anything...
    - **Login type**: API: use the `FAAS-RUNNER` API key we made in the previous step

## Configuring the FAAS Settings
1. From the *Quick Launch* menu, open Functions
2. In Functions, navigate to '*settings*'
3. in the first tab "Domain Whitelist", enter `sy.intentid.liveperson.net`
4. Now move to the '*secret storage*' tab, and click 'add a secret'
5. Name the secret 'FAAS-RUNNER'
6. From the below dropdown, select 'JSON'
7. Now, using the API Key credentials (which we made a note of prior), 
```json
{
 "username": "FAAS-RUNNER",
 "appKey": "{{app key}}",
 "secret": "{{secret}}",
 "accessToken": "{{access token}}",
 "accessTokenSecret": "{{access token secret}}",
 "bearer": null
}
```
8. Save and exit settings


## Create the function
1. Complete the *Coding Details* section with the following:
   * **Event**: No Event
   * **Template**: Greeting Template
   * **Access to external domains?**: No

	Click *Continue*

2. Complete the *Function Description* section with the following:
   * **Function Name**: faas-application-login
   * **Description**: Performs application login for authentication token

	Click *Create Function*

3. In the resulting code editor screen, replace the existing code with the following:
(The only configuration the Function should require is defined the Bots to used for logging in.)
```js
function lambda(input, callback) {
  const { Toolbelt } = require("lp-faas-toolbelt");
  const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise
  const secretClient = Toolbelt.SecretClient();

  // The Login Process will be executed for any bots listed in the below array to allow for support of additional login bots if required.
  const botNames = [
    'FAAS-Runner'
    ]
    

  const main = async (input, callback) => {
    // Get LP Host Domain For Agent Login End point    
    const lpDomain = async () => {
      const options = {
        method: "get",
        url: `https://api.liveperson.net/api/account/${process.env.BRAND_ID}/service/baseURI?version=1.0`,
        headers: {
          'Content-Type': 'application/json'
          }
      }
      try {
        const response = await httpClient(options)
        const data = JSON.parse(response)
        const agentVep = data.baseURIs.find(x => x.service === 'agentVep')
        return agentVep.baseURI;
        } catch (err) {
          console.error(JSON.stringify(key), JSON.stringify(err))
          return err;
        }
    };

    // Perform Application Login
    const app_login = async (key, agentVep) => {
      const options = {
        method: "POST",
        url: `https://${agentVep}/api/account/${process.env.BRAND_ID}/login?v=1.3`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: JSON.stringify(key),
        simple: false,
        resolveWithFullResponse: false
      }
      try {
        const response = await httpClient(options)        
        return response;
        } catch (err) {
          console.error(JSON.stringify(key), JSON.stringify(err))
          return err;
        }
    };

    // Update Secret Storage Token with fresh Bearer Token
    const updateToken = async (secretName, bearer, csrf) => {
      secretClient.readSecret(secretName)
      .then(mySecret => {        
        let value = mySecret.value;
        value.bearer = bearer;
        value.csrf = csrf;
        value.lastUpdate = Date.now();
        mySecret.value = value;        
        return secretClient.updateSecret(mySecret);
      })
      .then(_ => {
        callback(null, { message: "Successfully updated secret" });
      })
      .catch(err => {
        console.error(`Failed during secret operation with ${err.message}`);
        callback(err, null);
      });
    }
    
    const runProcess = async () => {
      const agentVep = await lpDomain();
      if (!agentVep) return { successResult: false }
      for (var i in botNames) {
        let appKey = await secretClient.readSecret(botNames[i]);
        const login = await app_login(appKey.value, agentVep);
        if (!login) {
          console.info("Bot login failed " + botNames[i])
          return { successResult: false, message: 'login failed for ' + botNames[i] }
          }
        let { bearer, csrf } = JSON.parse(login)
        updateToken(botNames[i], bearer, csrf);
        console.info("Bot login successful " + botNames[i])          
      }
      return { successResult: true }
    }

    callback(null, runProcess());
    }
    main(input, callback);
  }
```

4. After saving, deploy the function using the three-dot menu at the end of the function's row. Once deployed, invoke the function to test and ensure that it is working. If successful, `Bot login successful {{botname}}`
5. Schedule the FaaS invocation by selecting the *Schedules* tab from the left-hand menu. Tap the *Create a schedule* button and select the newly deployed function from the resulting dropdown.
10. Schedule the function invocation to invoke every 30 minutes by entering `/30` in the *Minutes* field

With the function scheduled, the Function will invoke every 30 minutes and refresh the Bearer token for any other functions to leverage! ~Great success!


## Troubleshooting
Reasons for this function failing will typically be related to the API key, user agent, or secret (in FAAS secret storage)
Check the following to ensure everything is configured correctly
1. The Conversational Cloud User
  a. Using API key method for login, and assigned with the correct API Key
  b.  The Login name matches the bot name provided in the FAAS function

2. The API Key
  - The API Key has 'login' enabled
  - It is enabled

3. The FAAS Secret
  - Unfortunately for troubleshooting, the FAAS Secret is encrypted so we cannot open it and confirm if it was setup correctly.
  - It may be worth however, deleting the key and following the steps above (under FAAS settings) again and double check that "JSON" type was selected when creating the secret
