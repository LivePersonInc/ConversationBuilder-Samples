function lambda(input, callback) {
    // Importing the FaaS Toolbelt
    const { Toolbelt } = require("lp-faas-toolbelt");
    // Obtain an HTTPClient Instance from the Toolbelt
    const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise
    const secretClient = Toolbelt.SecretClient();
    // update for your shopify store custom app
    const shopifyURL = "https://examplestring:shppa_examplestring@yourstorename.myshopify.com/admin/api/2021-10/products.json" 
    let region = z1; // update for your account
    let accountNumber = "123456789"; // update for your account
    let MAVEN_API_KEY = ""; // create a FaaS secret with this name
    let shopifyItems;
    let namespace = "Shopify"
    secretClient 
        .readSecret("MAVEN_API_KEY")
        .then(mySecret => {
          let value = mySecret.value;
          MAVEN_API_KEY = value; 
          console.info("API key for context service set")
        })
        .then(_ => {
          // get shopify items
      httpClient(shopifyURL, {
          method: "GET"
      }).then(response => {
          shopifyItems = response;
          let parsedItems = JSON.parse(shopifyItems)
          console.info("Number of store products: " + parsedItems.products.length);
          
          // create namespace
          let namespaceURL = `https://${region}.context.liveperson.net/v1/account/${accountNumber}`;
          httpClient(namespaceURL, {
              method: "POST",
              headers: {
              "Content-Type": "application/json",
              "maven-api-key": MAVEN_API_KEY
              },
              body: JSON.stringify({"name": namespace})
          }).then(_ => {
              console.info("namespace created");
  
              // write data to the namespace
              let contextUpdateURL = `https://${region}.context.liveperson.net/v1/account/${accountNumber}/${namespace}/properties`;
              httpClient(contextUpdateURL, {
                      method: "PATCH",
                      headers: {
                      "Content-Type": "application/json",
                      "maven-api-key": MAVEN_API_KEY
                      },
                      body: shopifyItems
                  }).then(_ => {
                      console.info("namespace populated");
                      return callback(null, shopifyItems);
                  }).catch(err => callback(err, null));
              }).catch(err => callback(err, null));
          }).catch(err => callback(err, null));
        }).catch(err => callback(err, null));
  }