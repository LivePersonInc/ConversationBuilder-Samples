function lambda(input, callback) {
  const { Toolbelt } = require("lp-faas-toolbelt");
  const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise
  const secretClient = Toolbelt.SecretClient();
  // The Login Process will be executed for any bots listed in the below array to allow for support of additional login bots if required.
  const botNames = [
    'FAAS-Runner'
    ]
  const main = async (input, callback) => {
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
    const updateToken = async (secretName, newValues) => {
      secretClient.readSecret(secretName)
      .then(mySecret => {        
        const u = {...mySecret.value, ...newValues};
        mySecret.value = u;
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
        let { bearer, csrf, config } = JSON.parse(login)
        updateToken(botNames[i], {bearer, csrf, config});
        console.info("Bot login successful " + botNames[i])          
      }
      return { successResult: true }
    }
    callback(null, runProcess());
    }
    main(input, callback);
  }