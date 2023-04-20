import './popup.css';
// const {Ajv} = require("ajv").default;
// var Validator = require('jsonschema').Validator;

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
            var v = new Validator();
            var instance = 4;
            var schema = { "type": "number" };
            console.log(v.validate(instance, schema));
        //const schema = result.json();
        //console.log(schema)
        //console.log(v.validate(contributors_info, schema));
    }) */
/*         .then(result => {
            const schema = result.json()
            console.log(schema)
            const ajv = new Ajv();
            const validate = ajv.compile(schema)
            const valid = validate(data)
            console.log(valid)
        })
        //.catch(err => console.error(err)); */
    // Send contributors info to background
    port.postMessage({ input_type: "schema", contributors_info: contributors_info });
}

function sendUrlInput() {
    const contributors_url = document.getElementById("contributor_url").value;

    port.postMessage({ input_type: "url", contributors_url: contributors_url })
}

// Send popup.html input to background.js for autofilling
submit.addEventListener('click', sendSchemaInput);
submitUrl.addEventListener('click', sendUrlInput)

// Close popup window if background.js is finished
port.onMessage.addListener(function(msg) {
    if (msg.closePopup) console.log('submitted')
    // This is commented out for testing purposes only
    // window.close();
  });
