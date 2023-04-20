
import { nhb_recipe } from './nhb_recipe.js';
import { spreadsheetToSchema } from './utils.js';

// autofill function
function autofill(contributors_info) {
    // Call journal recipe function
    // This function will run in the context of the background.js
    // A separate function is used to better differentiate between multiple, different submission portals later
    nhb_recipe(contributors_info)
}

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        if (msg.input_type === "schema") {
            console.log("schema")
            // Fill out submission portal automatically
            autofill(msg.contributors_info)
        } else if (msg.input_type === "url") {
            console.log("url")
            // Find the spreadsheet ID
            let parts = msg.contributors_url.split("/");
            let spreadsheetId = parts[parts.length - 2];
            // Find the oAuth token
            chrome.identity.getAuthToken({ interactive: true }, function (token) {
                // Fetch spreadsheet metadata
                // Since there is no way for getting sheet data by sheetid we first get the sheet metadata
                fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(r => {
                    return r.json()
                }).then(metadata => {
                    // Get sheet name
                    // For now we will assume the infromation is on the first sheet
                    return metadata.sheets[0].properties["title"]
                }).then(sheetTitle => {
                    // Get values
                    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(r => {
                        return r.json() 
                    }).then(data => {
                        spreadsheetToSchema(data.values)
                    })
                }).catch(err => console.error(err));
            });
        }

        // Send message to close popup window
        port.postMessage({ closePopup: true })
    });
})
