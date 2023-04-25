const domain="example.com";
const PRIVATE_KEY = '';
const CLIENT_EMAIL = '';

function checkData(data) {
  var allDomainUsers = listAllDomainUsers(domain);
  var userInfo = [];
  if (data['userEmailList'].length > 0) {
    var manualListOfUsers = data['userEmailList'].split('\n');
  } else {
    var manualListOfUsers = [];
  }
  if (data['groupEmail'].length > 0) {
    var groupUsers = AdminDirectory.Members.list(groupKey=data['groupEmail'])
    groupUsers['members'].forEach(function(item) {
      var user = allDomainUsers[item['email']];
      var fullName = user['name']['fullName'];
      if ("organizations" in user && user["organizations"].length > 0) {
        var jobTitle = user['organizations'][0]['title'];
      } else {
        var jobTitle = "";
      }
      userInfo.push({
        "email": item['email'],
        "full_name": fullName,
        "job_title": jobTitle
      })
    })
  }
  for (let i = 0; i < manualListOfUsers.length; i++) {
    item = manualListOfUsers[i]
    try {
      var user = AdminDirectory.Users.get(userKey=item);
    } catch (err) {
      throw new Error(`${item} not found`);
    }
    userInfo.push({
      "email": item,
      "full_name": user['name']['fullName'],
      "job_title": user['organizations'][0]['title']
    })
  }

  var exampleSignature = data['signatureHTML']
  exampleSignature = exampleSignature.replace('{user_full_name}', userInfo[0]['full_name'])
  exampleSignature = exampleSignature.replace('{user_job_title}', userInfo[0]['job_title'])
  return {'ok': true, 'exampleSignature': exampleSignature, 'rawUserData': userInfo}
}

function applySignatures(data) {
    var userInfo = data['rawUserData']
    var userSignature = data['signatureHTML']
    userSignature = userSignature.replace('{user_full_name}', userInfo['full_name'])
    userSignature = userSignature.replace('{user_job_title}', userInfo['job_title'])
    var res = setSignatureForUser(userInfo['email'], userSignature)
    if (res) {
      return {'ok': true, 'email': userInfo['email'], 'text': `Signature updated for ${userInfo['email']}`}
    } else {
      return {'ok': false, 'email': userInfo['email'], 'text': `Failed to update signature for ${userInfo['email']}: ${res}`}
    }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile("main.html");
}

// Email address of the user to impersonate.

/**
 * Authorizes and makes a request to the Google Drive API.
 */
function setSignatureForUser(impersonating, signature) {
  var service = getService_(impersonating);
  if (service.hasAccess()) {
    var url = `https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/${impersonating}`;
    var options = {
      'method' : 'patch',
      'payload' : JSON.stringify({"signature": signature}),
      'headers': {
        'Authorization': 'Bearer ' + service.getAccessToken(),
        'Content-Type': 'application/json'
      }
    };
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    return true
  } else {
    Logger.log(service.getLastError());
    return JSON.stringify(result, null, 2)
  }
}

function getSignatureForUser(impersonating) {
  var service = getService_(impersonating);
  if (service.hasAccess()) {
    var url = `https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/${impersonating}`;
    var options = {
      'headers': {
        'Authorization': 'Bearer ' + service.getAccessToken(),
        'Content-Type': 'application/json'
      }
    };
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    //Logger.log(JSON.stringify(result, null, 2));
    return result
  } else {
    Logger.log(service.getLastError());
    return result
  }
}

function checkUsersSignatures() {
  var groupUsers = AdminDirectory.Members.list(groupKey="")
  groupUsers['members'].forEach(function(item) {
    var userSignature = getSignatureForUser(item['email']);
    if (userSignature['signature'].includes("bit.ly")) {
      Logger.log(`${item['email']}`);
    }
  })
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService_().reset();
}

/**
 * Configures the service.
 */
function getService_(impersonating) {
  return OAuth2.createService('Gmail:' + impersonating)
      // Set the endpoint URL.
      .setTokenUrl('https://oauth2.googleapis.com/token')

      // Set the private key and issuer.
      .setPrivateKey(PRIVATE_KEY)
      .setIssuer(CLIENT_EMAIL)

      // Set the name of the user to impersonate. This will only work for
      // Google Apps for Work/EDU accounts whose admin has setup domain-wide
      // delegation:
      // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
      .setSubject(impersonating)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scope. This must match one of the scopes configured during the
      // setup of domain-wide delegation.
      .setScope('https://www.googleapis.com/auth/gmail.settings.basic');
}

function listAllDomainUsers(domain) {
  var allDomainUsers = [];
  var sortedDomainUsers = {};
  const pageSize = 500;
  var domainUsersResponse = AdminDirectory.Users.list({'domain':domain, 'maxResults': pageSize});
  allDomainUsers.push(...domainUsersResponse['users']);
  while (domainUsersResponse.nextPageToken) {
    domainUsersResponse = AdminDirectory.Users.list({'domain':domain, 'maxResults': pageSize, 'pageToken': domainUsersResponse['nextPageToken']});
    allDomainUsers.push(...domainUsersResponse['users']);
  }
  allDomainUsers.forEach(function(item) {
    sortedDomainUsers[item['primaryEmail']] = item;
  })
  return sortedDomainUsers;
}
