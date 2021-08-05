function lambda(input, callback) {

    // imports
    const { Toolbelt } = require('lp-faas-toolbelt');

    const domain = "z1"; // get your relevant domain from https://developers.liveperson.com/domain-api.html and add it here
    const accountNumber = ""; // add your account number here
    const namespace = ""; // add your desired namespace here
    let isCustomerVip = false;
    let API_KEY = '';
    let sessionId = input.payload;
    console.info("sessionId: " + sessionId);

    // list of customers and their VIP status. in practice, this would probably come from an API call.
    // in the bot interaction, we've asked the customer to provide their customer id # and we'll use this to check their VIP status

    const customers = [
        {
            id: 123,
            vip: true,
            name: "Reginald"
        },
        {
            id: 321,
            vip: false,
            name: "Troy"
        }
    ]

    // get secret api key

    let secretClient = Toolbelt.SecretClient();
    secretClient
      .readSecret("API_KEY")
      .then(mySecret => {
        let value = mySecret.value;
        API_KEY = value;
      })
      .then(_ => {
        let sessionString = `https://${domain}.context.liveperson.net/v1/account/${accountNumber}/${namespace}/${sessionId}/properties`;

        const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise

        // using the sessionId we passed into the function, we'll check to see if the chatting user is a VIP or not and return that

        httpClient(sessionString, {
            method: "GET", // HTTP VERB
            headers: {
            'Content-Type': 'application/json',
            'maven-api-key': API_KEY
            }, // Your Headers
            simple: false, // IF true => Status Code != 2xx & 3xx will throw
            resolveWithFullResponse: false //IF true => Includes Status Code, Headers etc.
        })
        .then(response => {
            let obj = JSON.parse(response);
            let customerId = obj.customerId;
            console.info("customerId: " + customerId)

            // check if a VIP
            customers.map(customer => {
                if (customer.id == customerId && customer.vip == true) {
                        isCustomerVip = true;
                    }
                }) 
            console.info(isCustomerVip)
            callback(null, isCustomerVip);  
        })
        .catch(err => {
            console.info(err)
        })
      })
      .catch(error => {
        console.error(`Failed during secret operation with ${err.message}`);
        callback(error, null);
      });
}