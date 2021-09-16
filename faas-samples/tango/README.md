# Tango
- This solution performs a check to confirm that the Bot is currently assigned (active) on a conversation, and based on the active state will perform a 'join' or 'remove' of that Bot.

---

# Function Preparation
The 'tango' function requires a secondary user to perform the invocation of the join/remove (tango)

## Creating the Conversational Cloud user
1. Within CC, navigate to API keys (campaigns -> data -> API keys)
2. Create a new API Key, name it 'FAAS-RUNNER'
   The API key should have the following permissions enabled:
   * login
   * Conversation History / Messaging Interactions 
3. Make a note of the API key credentials (App key, Secret, Access Token, Access Token Secret) as we will need these in subequent steps

4. Navigate to 'USERS' 
5. Create a new Conversational Cloud user account with a login name of 'FAAS-RUNNER' (use the same for fullName, nickName)
   ** The 'FAAS-RUNNER' Bot user should have Administrator and Agent Manager Roles assigned, and be a manager of the Main Group (or top level agent group)
   ** email address can be anything
   ** login type is API: use the 'FAAS-RUNNER' API key we made in the previous step

## Configuring the FAAS Settings
1. From the Quick Launch menu, open Functions

2. In Functions, navigate to 'settings'

3. in the first tab "Domain Whitelist", enter `sy.intentid.liveperson.net`

4. Now move to the 'secret storage' tab, and click 'add a secret'

5. Name the secret 'FAAS-RUNNER'

6. From the below dropdown, select 'JSON'

7. Now, using the API Key credentials (which we made a note of prior), 
```json
{
 "username": "FAAS-RUNNER",
 "appKey": "{{app key}}",
 "secret": "{{secret}}",
 "accessToken": "{{access token}}",
 "accessTokenSecret": "{{access token secret}}"
}
```
  


