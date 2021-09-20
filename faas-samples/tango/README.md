# Tango

- This solution performs a check to confirm that the Bot is currently assigned (active) on a conversation, and based on the active state will perform a 'join' or 'remove' of that Bot.

---

# Function Preparation

This function requires the 'Bearer Bot' function to be implemented to both authenticate the contained APIs, and generate user details required for the API configurations.

## Configuring the FAAS Settings

1. From the _Quick Launch_ menu, open Functions
2. In Functions, navigate to '_settings_'
3. in the first tab "Domain Whitelist", enter `sy.intentid.liveperson.net`

## Create the function

1. Complete the _Coding Details_ section with the following:

   - **Event**: No Event
   - **Template**: Greeting Template

   Click _Continue_

2. Complete the _Function Description_ section with the following:

   - **Function Name**: BOT_TANGO
   - **Description**: Joins and Removes Assist Bots to/from a conversation

   Click _Create Function_

3. In the resulting code editor screen, replace the existing code with the following:

```js
function lambda(input, callback) {
  const { Toolbelt } = require("lp-faas-toolbelt");
  const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise
  const secretClient = Toolbelt.SecretClient();
  const tokenSecretName = "FAAS-Runner";
  const { conversationId, agentLoginName, leUserId } = input.payload;

  const lpDomain = async () => {
    const options = {
      method: "get",
      url: `https://api.liveperson.net/api/account/${process.env.BRAND_ID}/service/baseURI?version=1.0`,
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await httpClient(options);
      const data = JSON.parse(response);
      let doms = {};
      for (const i in data.baseURIs) {
        doms[data.baseURIs[i].service] = data.baseURIs[i].baseURI;
      }
      return doms;
    } catch (err) {
      console.error(`lpDomain() -> ${JSON.stringify(err)}`);
      return err;
    }
  };

  const getMsgHist = async (bearer, DOMAIN) => {
    if (!bearer || !DOMAIN) {
      console.error(
        `error undefined prop: bearer ${!!bearer} | domain ${!!DOMAIN}`
      );
      return;
    }
    const options = {
      method: "POST",
      url: `https://${DOMAIN}/messaging_history/api/account/${process.env.BRAND_ID}/conversations/conversation/search`,
      body: JSON.stringify({
        conversationId,
        contentToRetrieve: [
          "info",
          "agentParticipantsActive",
          "consumerParticipants",
        ],
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + bearer,
      },
    };
    try {
      const response = await httpClient(options);
      const records = JSON.parse(response).conversationHistoryRecords;
      return records.length === 0 ? null : records[0];
      // return 200;
    } catch (err) {
      console.error("error: " + JSON.stringify(err));
      return;
    }
  };

  const botJoin = async (config) => {
    const { agentLoginName, leUserId, executorId, type, bearer, DOMAIN } =
      config;
    // for (const b in Object.keys(config)) { if (!Object.values(config)[b]) console.error(`missing properties ${Object.keys(config)[b]}`); return; }
    const options = {
      url: `https://${DOMAIN}/v1/userjoin/${type}/${conversationId}`,
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
        "user-id": `${executorId}`,
        "account-id": process.env.BRAND_ID,
        Connection: "keep-alive",
      },
      body: JSON.stringify({
        conversationId: conversationId,
        leUserId: leUserId,
        brandId: process.env.BRAND_ID,
        userName: agentLoginName,
      }),
      simple: false,
      resolveWithFullResponse: true,
    };
    console.info(JSON.stringify(options));
    try {
      const response = await httpClient(options);
      return { status: "success" };
    } catch (err) {
      return { status: "fail", error: JSON.stringify(err) };
    }
  };

  const main = async (input, callback) => {
    // get LP Domains
    const LP_DOMAINS = await lpDomain();
    // get auth token from secret storage
    const token = await secretClient.readSecret(tokenSecretName);
    if (!token) {
      return { status: "fail", error: "token missing" };
    }
    const { bearer, config } = token.value;
    // get active agent participants from messaging interactions API and set 'join' or 'remove'
    const metadata = await getMsgHist(bearer, LP_DOMAINS.msgHist);
    if (!metadata) return { status: "fail", error: "msgHist data missing" };
    const record = metadata;
    let type = "join";
    if (record.hasOwnProperty("agentParticipantsActive")) {
      const bot = record.agentParticipantsActive.find(
        (x) => x.agentLoginName === agentLoginName
      );
      if (bot) type = "remove";
    }

    // let's tango!
    const tango = await botJoin({
      agentLoginName,
      leUserId,
      executorId: config.userId,
      type,
      bearer,
      DOMAIN: LP_DOMAINS.coreAIIntent,
    });
    return { result: tango };
  };

  callback(null, main());
}
```

4. With the code updated, confirm that the value for "tokenSecretName" (on line 5) is using the correct secret (e.g: 'FAAS-Runner)

## Invoking the function

The function takes in 3 arguments:

- `conversationId` : the conversationId...
- `agentLoginName` : the loginName for the bot that is to be joined or removed to/from the conversation
- `leUserId` : the userid for the bot that is to be joined or removed to/from the conversation.

The userid can be obtained from the "users" export within Converstion Cloud (Users section), or by opening the user and taking the id from the URL (this will be the last set of numbers in the url)
