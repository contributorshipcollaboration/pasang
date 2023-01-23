import './popup.css';
//import Ajv from 'ajv'
// Require does not work
// const {gapi} = require('googleapis');
const {loremIpsum} = require("lorem-ipsum");

// Get submit button
const submit = document.getElementById("submit");
const submitUrl = document.getElementById("url-submit")

// All tasks will be done in the background.js file
// popup.js is only used to communicate with the user directly
// Setting up a long-lived communication between popup.js and background.js
var port = chrome.runtime.connect({
    name: "popup-background"
});

// Submit contributors_info input to background.js as JSON
function sendSchemaInput() {
    // Get contributors info
    const contributors_info = JSON.parse(document.getElementById("contributor_schema").value)
    // Validate input
    // Not working because of CPS policy
/*     fetch('https://raw.githubusercontent.com/tenzing-contrib/belayer/main/belayer-flat-schema.json')
        .then(result => {
            const schema = result.json()
            const ajv = new Ajv()
            const validate = ajv.compile(schema)
            const valid = validate(data)
            console.log(valid)
        })
        .catch(err => console.error(err)); */
    // Send contributors info to background
    port.postMessage({ input_type: "schema", contributors_info: contributors_info });
}

function sendUrlInput() {
    const contributor_url = document.getElementById("contributor_url").value;
    // Find the spreadsheet ID
    // TODO: Later put this in background.js
/*     let parts = contributor_url.split("/");
    let spreadsheetId = parts[parts.length - 2];
    console.log(spreadsheetId)

    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        ranges: []
    })
    .then(function(response) {
      console.log(response.result);
    }, function(reason) {
      console.error('error: ' + reason.result.error.message);
    }); */

    port.postMessage({ input_type: "url" })
}

// Send popup.html input to background.js for autofilling
submit.addEventListener('click', sendSchemaInput);
submitUrl.addEventListener('click', sendUrlInput)

// Close popup window if background.js is finished
port.onMessage.addListener(function(msg) {
    if (msg.closePopup) console.log('submitted')
    // window.close();
  });

submit.innerText = loremIpsum()
