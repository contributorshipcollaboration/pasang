import './popup.css';
// import Ajv from 'ajv'

// Get submit button
const submit = document.getElementById("submit");

// All tasks will be done in the background.js file
// popup.js is only used to communicate with the user directly
// Setting up a long-lived communication between popup.js and background.js
var port = chrome.runtime.connect({
    name: "popup-background"
});

// Submit contributors_info input to background.js as JSON
function sendInput() {
    // Get contributors info
    const contributors_info = JSON.parse(document.getElementById("contributor_information").value)
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
    port.postMessage({contributors_info: contributors_info});
}

// Send popup.html input to background.js for autofilling
submit.addEventListener('click', sendInput);

// Close popup window if background.js is finished
port.onMessage.addListener(function(msg) {
    if (msg.closePopup) console.log('submitted')
    // window.close();
  });