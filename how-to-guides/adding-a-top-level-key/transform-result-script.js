var response = botContext.getBotVariable('api_Locations');
var jsonData = JSON.parse(response.jsonData);
var newJson = {
  "api_Locations": {
    "stores": jsonData.api_Locations,
  }
};
response.jsonData = JSON.stringify(newJson);
botContext.setBotVariable('api_Locations', response, true, false);