function lambda(input, callback) {
  const { Toolbelt } = require("lp-faas-toolbelt");
  const httpClient = Toolbelt.HTTPClient(); // For API Docs look @ https://www.npmjs.com/package/request-promise
  const secretClient = Toolbelt.SecretClient();
  const tokenSecretName = 'FAAS-Standard';
  // 'FAAS-Standard'

  input.payload.regionCode = "sy";
  const executorAgentId = 1403014670; // this is the ID from the user calling the function, i.e. - the FAAS Login agent (FAAS-Standard)
  // input.payload.conversationId = "c64456b9-5d4b-4563-8aa8-7011d8d332ca";
  // input.payload.agentLoginName = "testBot";
  // input.payload.leUserId = 1402155370;
  // input.payload.bearer = "af4c2626cb0bb9a2289690b1ec779ce5c8c0de47fe6a2889d5c04d5415fc22fd";


  const { regionCode, conversationId, agentLoginName, leUserId } = input.payload;


  const getMsgHist = async (bearer) => {
    const options = {
      method: "POST",
      url: `https://${regionCode}.msghist.liveperson.net/messaging_history/api/account/${process.env.BRAND_ID}/conversations/conversation/search`,
      body: JSON.stringify({ conversationId, "contentToRetrieve": ["info", "agentParticipantsActive", "consumerParticipants"] }),
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + bearer },
    }
    try {
      const response = await httpClient(options);
      const records = JSON.parse(response).conversationHistoryRecords
      return records.length === 0 ? null : records[0];
      // return 200;
    } catch (err) {
      console.error('error: ' + JSON.stringify(err))
      return;
    }
  };

  const botJoin = async (agentLoginName, leUserId, executorId, type, bearer) => {

    if (!conversationId || !bearer || !agentLoginName || !leUserId || !type) {
      console.error('missing properties')
      return;
    }
    const options = {
      url: `https://${regionCode}.intentid.liveperson.net/v1/userjoin/${type}/${conversationId}`,
      method: "POST",
      headers: {
        'Host': 'sy.intentid.liveperson.net',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`,
        'user-id': `${executorId}`,
        'account-id': process.env.BRAND_ID,
        'Origin': 'https://z3.le.liveperson.net',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ "conversationId": conversationId, "leUserId": leUserId, "brandId": process.env.BRAND_ID, "userName": agentLoginName }),
      simple: false,
      resolveWithFullResponse: true

    };
    console.info(JSON.stringify(options))
    try {
      const response = await httpClient(options)
      console.info('response')
      console.info(response)
      return response;
    } catch (err) {
      console.info('error')
      console.error(JSON.stringify(err))
      return;
    }
  }

  const main = async (input, callback) => {
    const token = await secretClient.readSecret(tokenSecretName);
    if (!token) { return; }
    const bearer = token.value.bearer;
    const metadata = await getMsgHist(bearer);
    if (!metadata) return;
    const record = metadata;
    const { latestAgentId } = record.info;
    // const executorAgentId = 1403014670;
    let type = 'join';
    if (record.hasOwnProperty('agentParticipantsActive')) {
      const bot = record.agentParticipantsActive.find(x => x.agentLoginName === agentLoginName);
      if (bot) type = 'remove';
    }
    // const botJoin = async (agentLoginName, leUserId, yourId, type, bearer)
    // console.info(JSON.stringify({
    //   agentLoginName, leUserId, latestAgentId, type, bearer
    // }))
    // const botJoin = async (agentLoginName, leUserId, yourId, type, bearer) => {    
    if (!agentLoginName || !leUserId || !executorAgentId || !type || !bearer) return
    const joinState = await botJoin(agentLoginName, leUserId, executorAgentId, type, bearer);
    console.info(`joinState: ${JSON.stringify(joinState)}`)
    return joinState;
  }
  callback(null, main());
}