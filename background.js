import { nhb_recipe } from './src/js/recipes/nhb_recipe.js';

// autofill function
function autofill(contributors_info) {
    // Call journal recipe function
    // This function will run in the context of the background.js
    // A separate function is used to better differentiate between multiple, different submission portals later
    nhb_recipe(contributors_info)
}

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        // Fill out submission portal automatically
        autofill(msg.contributors_info)
        // Send message to close popup window
        port.postMessage({closePopup: true})
    });
})
